<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

error_reporting(E_ALL);
ini_set('display_errors', 0);

session_start();
require_once './dbConnection.php';

$userId = $_SESSION['user_id'] ?? null;
if (!$userId) { echo json_encode(['success' => false, 'message' => 'Not authenticated']); exit; }

$data    = json_decode(file_get_contents('php://input'), true);
$levelId = intval($data['level_id'] ?? 0);
if (!$levelId) { echo json_encode(['success' => false, 'message' => 'Missing level_id']); exit; }

// Insert — unique constraint means double-completing is a no-op
$stmt = $conn->prepare("INSERT IGNORE INTO user_level_progress (user_id, level_id) VALUES (?, ?)");
$stmt->bind_param("ii", $userId, $levelId);
$stmt->execute();
$wasNew = $stmt->affected_rows > 0;

if ($wasNew) {
    // +50 XP for completing a level
    $conn->query("UPDATE users SET xp = xp + 50 WHERE id = $userId");
}

// Return updated level count
$stmt = $conn->prepare("SELECT COUNT(*) as cnt FROM user_level_progress WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$total = $stmt->get_result()->fetch_assoc()['cnt'];

echo json_encode(['success' => true, 'was_new' => $wasNew, 'total_levels_done' => intval($total)]);
$conn->close();
?>
