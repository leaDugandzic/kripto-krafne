<?php
// backend/competition_status.php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
require_once './dbConnection.php';

$stmt = $conn->prepare("SELECT * FROM competition_settings ORDER BY id DESC LIMIT 1");
$stmt->execute();
$result = $stmt->get_result();
$competition = $result->fetch_assoc();

if ($competition && $competition['is_active']) {
    $endTime   = strtotime($competition['end_time']);
    $startTime = strtotime($competition['start_time']);
    $currentTime = time();
    $timeRemaining = $endTime - $currentTime;

    // Auto-deactivate if time has run out
    if ($timeRemaining <= 0) {
        $conn->query("UPDATE competition_settings SET is_active = FALSE WHERE id = " . intval($competition['id']));
        $competition['is_active'] = false;

        echo json_encode([
            'success'        => true,
            'is_active'      => false,
            'just_ended'     => true,
            'competition'    => $competition,
            'time_remaining' => 0
        ]);
        exit;
    }

    echo json_encode([
        'success'        => true,
        'is_active'      => true,
        'competition'    => $competition,
        'time_remaining' => $timeRemaining,
        'start_time'     => $competition['start_time'],
        'end_time'       => $competition['end_time']
    ]);
} else {
    // Return last competition info even if not active (so frontend knows it ended)
    echo json_encode([
        'success'     => true,
        'is_active'   => false,
        'competition' => $competition, // may be null if never started
        'message'     => 'No active competition'
    ]);
}

$conn->close();
?>