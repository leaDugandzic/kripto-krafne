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

// Get active competition
$comp = $conn->query("SELECT * FROM competition_settings WHERE is_active = TRUE ORDER BY id DESC LIMIT 1")->fetch_assoc();

if (!$comp) {
    echo json_encode(['success' => true, 'is_active' => false, 'events' => []]);
    exit;
}

// Last 10 solve events during current competition
$stmt = $conn->prepare("
    SELECT
        tp.task_number,
        tp.solved_at,
        t.name  AS team_name,
        t.id    AS team_id,
        u.ime   AS solver_name,
        u.id    AS solver_id
    FROM team_progress tp
    JOIN teams t ON tp.team_id = t.id
    LEFT JOIN users u ON tp.solved_by_user_id = u.id
    WHERE tp.solved_at >= ?
    ORDER BY tp.solved_at DESC
    LIMIT 10
");
$stmt->bind_param("s", $comp['start_time']);
$stmt->execute();
$events = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

echo json_encode([
    'success'    => true,
    'is_active'  => true,
    'end_time'   => $comp['end_time'],
    'events'     => $events,
]);

$conn->close();
?>
