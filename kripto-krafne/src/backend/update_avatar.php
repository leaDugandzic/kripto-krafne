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

$data   = json_decode(file_get_contents('php://input'), true);
$avatar = $data['avatar'] ?? '';

$valid = ['cowboy','driver','explorer','flower','glasses','headphones','kitty','mr','muscle','sleepy'];

if (!in_array($avatar, $valid)) {
    echo json_encode(['success' => false, 'message' => 'Invalid avatar']);
    exit;
}

$stmt = $conn->prepare("UPDATE users SET avatar = ? WHERE id = ?");
$stmt->bind_param("si", $avatar, $userId);
$stmt->execute();

$_SESSION['avatar'] = $avatar;

echo json_encode(['success' => true, 'avatar' => $avatar]);
$conn->close();
?>
