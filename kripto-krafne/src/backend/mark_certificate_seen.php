<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

session_start();
require_once './dbConnection.php';

$userId = $_SESSION['user_id'] ?? null;
if (!$userId) { echo json_encode(['success' => false]); exit; }

$data   = json_decode(file_get_contents('php://input'), true);
$compId = intval($data['competition_id'] ?? 0);
if (!$compId) { echo json_encode(['success' => false]); exit; }

$stmt = $conn->prepare("INSERT IGNORE INTO user_certificate_seen (user_id, competition_id) VALUES (?, ?)");
$stmt->bind_param("ii", $userId, $compId);
$stmt->execute();

echo json_encode(['success' => true]);
$conn->close();
?>
