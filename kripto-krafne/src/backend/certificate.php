<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

error_reporting(E_ALL);
ini_set('display_errors', 0);
session_start();

require_once './dbConnection.php';

$userId      = $_SESSION['user_id'] ?? null;
$isAdmin     = $_SESSION['is_admin'] ?? 0;
$compIdParam = isset($_GET['competition_id']) ? intval($_GET['competition_id']) : null;
$teamIdParam = isset($_GET['team_id'])        ? intval($_GET['team_id'])        : null;

if (!$userId) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']); exit;
}

// ── Resolve team_id from archive ──────────────────────────────────────────────
$teamId = $teamIdParam;
if (!$teamId && $compIdParam) {
    $stmt = $conn->prepare("SELECT team_id FROM comp_archive_members WHERE competition_id = ? AND user_id = ?");
    $stmt->bind_param("ii", $compIdParam, $userId);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    if ($row) $teamId = $row['team_id'];
}
if (!$teamId) {
    // Fallback: current live team (e.g. during an active competition)
    $stmt = $conn->prepare("SELECT team_id FROM team_members WHERE user_id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    if ($row) $teamId = $row['team_id'];
}
if (!$teamId) {
    echo json_encode(['success' => false, 'message' => 'You are not in a team']); exit;
}

// ── Read from archive (historical certificate) ────────────────────────────────
if ($compIdParam) {
    // Verify access: must be a member of this team in the archive, or admin
    if (!$isAdmin) {
        $stmt = $conn->prepare("SELECT 1 FROM comp_archive_members WHERE competition_id = ? AND team_id = ? AND user_id = ?");
        $stmt->bind_param("iii", $compIdParam, $teamId, $userId);
        $stmt->execute();
        if (!$stmt->get_result()->fetch_assoc()) {
            echo json_encode(['success' => false, 'message' => 'Access denied']); exit;
        }
    }

    $stmt = $conn->prepare("
        SELECT team_id AS id, team_name AS name, final_score AS score, tasks_solved, placement
        FROM comp_archive_teams WHERE competition_id = ? AND team_id = ?
    ");
    $stmt->bind_param("ii", $compIdParam, $teamId);
    $stmt->execute();
    $teamData = $stmt->get_result()->fetch_assoc();
    if (!$teamData) {
        echo json_encode(['success' => false, 'message' => 'No archive data for this team/competition']); exit;
    }

    $stmt = $conn->prepare("
        SELECT user_id AS id, username, avatar, is_captain
        FROM comp_archive_members WHERE competition_id = ? AND team_id = ?
        ORDER BY is_captain DESC
    ");
    $stmt->bind_param("ii", $compIdParam, $teamId);
    $stmt->execute();
    $members = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    $stmt = $conn->prepare("SELECT COUNT(*) AS c FROM comp_archive_teams WHERE competition_id = ?");
    $stmt->bind_param("i", $compIdParam);
    $stmt->execute();
    $totalTeams = intval($stmt->get_result()->fetch_assoc()['c']);

    $stmt = $conn->prepare("SELECT id, start_time, end_time FROM competition_settings WHERE id = ?");
    $stmt->bind_param("i", $compIdParam);
    $stmt->execute();
    $comp = $stmt->get_result()->fetch_assoc();

    echo json_encode([
        'success'      => true,
        'team'         => [
            'id'    => intval($teamData['id']),
            'name'  => $teamData['name'],
            'score' => intval($teamData['score']),
        ],
        'members'      => $members,
        'tasks_solved' => intval($teamData['tasks_solved']),
        'total_tasks'  => 6,
        'placement'    => intval($teamData['placement']),
        'total_teams'  => $totalTeams,
        'competition'  => $comp ? [
            'id'         => intval($comp['id']),
            'start_time' => $comp['start_time'],
            'end_time'   => $comp['end_time'],
        ] : null,
    ]);
    $conn->close(); exit;
}

// ── Live fallback (no competition_id) ─────────────────────────────────────────
$stmt = $conn->prepare("SELECT id, name, score, last_solved FROM teams WHERE id = ?");
$stmt->bind_param("i", $teamId);
$stmt->execute();
$team = $stmt->get_result()->fetch_assoc();
if (!$team) { echo json_encode(['success' => false, 'message' => 'Team not found']); exit; }

$stmt = $conn->prepare("
    SELECT u.id, u.ime AS username, u.avatar, tm.is_captain
    FROM team_members tm JOIN users u ON tm.user_id = u.id
    WHERE tm.team_id = ? ORDER BY tm.is_captain DESC, tm.joined_at ASC
");
$stmt->bind_param("i", $teamId);
$stmt->execute();
$members = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

$stmt = $conn->prepare("SELECT COUNT(*) AS cnt FROM team_progress WHERE team_id = ?");
$stmt->bind_param("i", $teamId);
$stmt->execute();
$tasksSolved = intval($stmt->get_result()->fetch_assoc()['cnt']);

$stmt = $conn->prepare("SELECT COUNT(*) AS cnt FROM teams WHERE score > ? OR (score = ? AND last_solved < ?)");
$stmt->bind_param("iis", $team['score'], $team['score'], $team['last_solved']);
$stmt->execute();
$placement = intval($stmt->get_result()->fetch_assoc()['cnt']) + 1;

$totalTeams = intval($conn->query("SELECT COUNT(*) AS c FROM teams")->fetch_assoc()['c']);
$comp = $conn->query("SELECT id, start_time, end_time FROM competition_settings ORDER BY id DESC LIMIT 1")->fetch_assoc();

echo json_encode([
    'success'      => true,
    'team'         => ['id' => intval($team['id']), 'name' => $team['name'], 'score' => intval($team['score'])],
    'members'      => $members,
    'tasks_solved' => $tasksSolved,
    'total_tasks'  => 6,
    'placement'    => $placement,
    'total_teams'  => $totalTeams,
    'competition'  => $comp ? ['id' => intval($comp['id']), 'start_time' => $comp['start_time'], 'end_time' => $comp['end_time']] : null,
]);
$conn->close();
?>
