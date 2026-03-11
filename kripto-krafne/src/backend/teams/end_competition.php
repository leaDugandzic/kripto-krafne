<?php
// backend/teams/end_competition.php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
require_once '../dbConnection.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$userId = $_SESSION['user_id'] ?? null;

if (!$userId) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

// Verify admin
$stmt = $conn->prepare("SELECT is_admin FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if (!$user || !$user['is_admin']) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Admin access required']);
    exit;
}

// Check there is an active competition to end
$stmt = $conn->prepare("SELECT id FROM competition_settings WHERE is_active = TRUE LIMIT 1");
$stmt->execute();
$active = $stmt->get_result()->fetch_assoc();

if (!$active) {
    echo json_encode(['success' => false, 'message' => 'No active competition to end']);
    exit;
}

try {
    $stmt = $conn->prepare("UPDATE competition_settings SET is_active = FALSE, end_time = NOW() WHERE is_active = TRUE");
    $stmt->execute();

    if ($stmt->affected_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Could not end competition – no rows updated']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Competition ended successfully'
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'DB error: ' . $e->getMessage()]);
}

$conn->close();
?>