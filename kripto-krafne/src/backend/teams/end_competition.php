<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { http_response_code(200); exit(); }

session_start();
require_once '../dbConnection.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']); exit;
}

$userId = $_SESSION['user_id'] ?? null;
if (!$userId) { http_response_code(401); echo json_encode(['success' => false, 'message' => 'Not authenticated']); exit; }

$stmt = $conn->prepare("SELECT is_admin FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
if (!$user || !$user['is_admin']) { http_response_code(403); echo json_encode(['success' => false, 'message' => 'Admin access required']); exit; }

$stmt = $conn->prepare("SELECT * FROM competition_settings WHERE is_active = TRUE LIMIT 1");
$stmt->execute();
$active = $stmt->get_result()->fetch_assoc();
if (!$active) { echo json_encode(['success' => false, 'message' => 'No active competition to end']); exit; }

$compId    = intval($active['id']);
$startTime = $active['start_time'];
$endTime   = date('Y-m-d H:i:s');

$taskPoints = [1 => 200, 2 => 80, 3 => 100, 4 => 50, 5 => 100, 6 => 150];
$taskNames  = [1 => 'Radnici', 2 => 'Recept', 3 => 'Tajni Meni', 4 => 'Drag & Drop', 5 => 'Kolo Sreće', 6 => 'Galerija'];

try {
    $conn->begin_transaction();

    // ── 1. Count total participating teams ────────────────────────────────────
    $stmt = $conn->prepare("SELECT COUNT(DISTINCT team_id) AS c FROM team_progress WHERE solved_at BETWEEN ? AND ?");
    $stmt->bind_param("ss", $startTime, $endTime);
    $stmt->execute();
    $totalParticipants = intval($stmt->get_result()->fetch_assoc()['c']);

    // ── 2. Archive task stats ─────────────────────────────────────────────────
    $stmtTasks = $conn->prepare("
        INSERT INTO comp_archive_tasks
            (competition_id, task_number, task_name, points, teams_solved, total_teams, avg_minutes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            teams_solved = VALUES(teams_solved),
            total_teams  = VALUES(total_teams),
            avg_minutes  = VALUES(avg_minutes)
    ");
    $stmtInfo = $conn->prepare("
        SELECT COUNT(DISTINCT team_id) AS ts,
               AVG(TIMESTAMPDIFF(MINUTE, ?, solved_at)) AS avg_m
        FROM team_progress
        WHERE task_number = ? AND solved_at BETWEEN ? AND ?
    ");

    foreach ($taskPoints as $tn => $pts) {
        $name = $taskNames[$tn];
        $stmtInfo->bind_param("siss", $startTime, $tn, $startTime, $endTime);
        $stmtInfo->execute();
        $info = $stmtInfo->get_result()->fetch_assoc();
        $ts   = intval($info['ts']);
        $avg  = $info['avg_m'] !== null ? intval(round(floatval($info['avg_m']))) : null;
        $stmtTasks->bind_param("iisiiis", $compId, $tn, $name, $pts, $ts, $totalParticipants, $avg);
        $stmtTasks->execute();
    }

    // ── 3. Compute & archive team standings ───────────────────────────────────
    $stmt = $conn->prepare("
        SELECT
            t.id, t.name,
            SUM(CASE
                WHEN tp.task_number=1 THEN 200 WHEN tp.task_number=2 THEN 80
                WHEN tp.task_number=3 THEN 100 WHEN tp.task_number=4 THEN 50
                WHEN tp.task_number=5 THEN 100 WHEN tp.task_number=6 THEN 150
                ELSE 0 END) AS final_score,
            COUNT(DISTINCT tp.task_number) AS tasks_solved,
            MAX(tp.solved_at) AS last_solved
        FROM team_progress tp
        JOIN teams t ON tp.team_id = t.id
        WHERE tp.solved_at BETWEEN ? AND ?
        GROUP BY t.id
        ORDER BY final_score DESC, last_solved ASC
    ");
    $stmt->bind_param("ss", $startTime, $endTime);
    $stmt->execute();
    $standings = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    $stmtTeam = $conn->prepare("
        INSERT INTO comp_archive_teams
            (competition_id, team_id, team_name, final_score, tasks_solved, placement, last_solved)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            final_score  = VALUES(final_score),
            tasks_solved = VALUES(tasks_solved),
            placement    = VALUES(placement),
            last_solved  = VALUES(last_solved)
    ");
    $stmtMem = $conn->prepare("
        INSERT INTO comp_archive_members
            (competition_id, team_id, user_id, username, avatar, is_captain)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            username   = VALUES(username),
            avatar     = VALUES(avatar),
            is_captain = VALUES(is_captain)
    ");

    foreach ($standings as $rank => $t) {
        $tid        = intval($t['id']);
        $tname      = $t['name'];
        $fscore     = intval($t['final_score']);
        $tsolved    = intval($t['tasks_solved']);
        $placement  = $rank + 1;
        $lastSolved = $t['last_solved'];
        $stmtTeam->bind_param("iisiiis", $compId, $tid, $tname, $fscore, $tsolved, $placement, $lastSolved);
        $stmtTeam->execute();

        $mres = $conn->query("
            SELECT u.id, u.ime AS username, u.avatar, tm.is_captain
            FROM team_members tm JOIN users u ON tm.user_id = u.id
            WHERE tm.team_id = $tid
        ");
        while ($m = $mres->fetch_assoc()) {
            $uid       = intval($m['id']);
            $uname     = $m['username'];
            $avatar    = $m['avatar'];
            $isCaptain = intval($m['is_captain']);
            $stmtMem->bind_param("iiissi", $compId, $tid, $uid, $uname, $avatar, $isCaptain);
            $stmtMem->execute();
        }
    }

    // ── 4. Mark competition as ended ──────────────────────────────────────────
    $stmt = $conn->prepare("UPDATE competition_settings SET is_active = FALSE, end_time = ? WHERE id = ?");
    $stmt->bind_param("si", $endTime, $compId);
    $stmt->execute();

    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Natjecanje završeno i rezultati arhivirani.']);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'DB error: ' . $e->getMessage()]);
}

$conn->close();
?>
