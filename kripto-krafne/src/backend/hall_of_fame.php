<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once './dbConnection.php';

// Only competitions that have been archived (end_competition.php ran for them)
$compsResult = $conn->query("
    SELECT cs.id, cs.start_time, cs.end_time
    FROM competition_settings cs
    WHERE EXISTS (SELECT 1 FROM comp_archive_teams WHERE competition_id = cs.id)
    ORDER BY cs.id DESC
");

$competitions = [];

while ($comp = $compsResult->fetch_assoc()) {
    $compId = intval($comp['id']);

    // ── Teams from archive ────────────────────────────────────────────────────
    $stmt = $conn->prepare("
        SELECT team_id AS id, team_name AS name, final_score AS comp_score,
               tasks_solved, placement AS `rank`, last_solved
        FROM comp_archive_teams
        WHERE competition_id = ?
        ORDER BY placement ASC
    ");
    $stmt->bind_param("i", $compId);
    $stmt->execute();
    $teamsRaw = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    if (empty($teamsRaw)) continue;

    $teams = [];
    foreach ($teamsRaw as $t) {
        $tid   = intval($t['id']);
        $mstmt = $conn->prepare("
            SELECT user_id AS id, username, avatar, is_captain
            FROM comp_archive_members
            WHERE competition_id = ? AND team_id = ?
            ORDER BY is_captain DESC
        ");
        $mstmt->bind_param("ii", $compId, $tid);
        $mstmt->execute();
        $t['members']     = $mstmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $t['comp_score']  = intval($t['comp_score']);
        $t['tasks_solved']= intval($t['tasks_solved']);
        $t['rank']        = intval($t['rank']);
        $teams[]          = $t;
    }

    // ── Task stats from archive ───────────────────────────────────────────────
    $totalTeams = count($teams);
    $tstmt = $conn->prepare("
        SELECT task_number, task_name AS name, points, teams_solved, total_teams, avg_minutes
        FROM comp_archive_tasks
        WHERE competition_id = ?
        ORDER BY task_number ASC
    ");
    $tstmt->bind_param("i", $compId);
    $tstmt->execute();
    $taskRows = $tstmt->get_result()->fetch_all(MYSQLI_ASSOC);

    $taskStats = [];
    foreach ($taskRows as $s) {
        $tt = intval($s['total_teams']) ?: $totalTeams;
        $taskStats[] = [
            'task_number'    => intval($s['task_number']),
            'name'           => $s['name'],
            'points'         => intval($s['points']),
            'teams_solved'   => intval($s['teams_solved']),
            'completion_pct' => $tt > 0 ? round((intval($s['teams_solved']) / $tt) * 100) : 0,
            'avg_minutes'    => $s['avg_minutes'] !== null ? intval($s['avg_minutes']) : null,
        ];
    }

    $competitions[] = [
        'id'         => $compId,
        'start_time' => $comp['start_time'],
        'end_time'   => $comp['end_time'],
        'is_active'  => false,
        'teams'      => $teams,
        'task_stats' => $taskStats,
    ];
}

echo json_encode(['success' => true, 'competitions' => $competitions]);
$conn->close();
?>
