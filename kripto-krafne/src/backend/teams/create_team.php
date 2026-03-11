<?php
// backend/teams/create_team.php
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
    echo json_encode(['success' => false, 'message' => 'Not authenticated. Please log in.']);
    exit;
}

// Admins cannot create teams
$stmt = $conn->prepare("SELECT is_admin FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if ($user && $user['is_admin']) {
    echo json_encode(['success' => false, 'message' => 'Admins cannot create or join teams']);
    exit;
}

$input    = json_decode(file_get_contents('php://input'), true);
$teamName = trim($input['team_name'] ?? '');

if (empty($teamName)) {
    echo json_encode(['success' => false, 'message' => 'Team name is required']);
    exit;
}

if (strlen($teamName) > 50) {
    echo json_encode(['success' => false, 'message' => 'Team name too long (max 50 characters)']);
    exit;
}

// Check if user already in a team
$stmt = $conn->prepare("SELECT team_id FROM team_members WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'You are already in a team']);
    exit;
}

// Check team name uniqueness
$stmt = $conn->prepare("SELECT id FROM teams WHERE name = ?");
$stmt->bind_param("s", $teamName);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Team name is already taken']);
    exit;
}

// Create team + add user as captain (transaction)
try {
    $conn->begin_transaction();

    $stmt = $conn->prepare("INSERT INTO teams (name, score, created_at) VALUES (?, 0, NOW())");
    $stmt->bind_param("s", $teamName);
    $stmt->execute();
    $teamId = $conn->insert_id;

    $stmt = $conn->prepare("INSERT INTO team_members (team_id, user_id, is_captain, joined_at) VALUES (?, ?, TRUE, NOW())");
    $stmt->bind_param("ii", $teamId, $userId);
    $stmt->execute();

    $conn->commit();

    echo json_encode([
        'success'   => true,
        'message'   => 'Team created successfully!',
        'team_id'   => $teamId,
        'team_name' => $teamName
    ]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

$conn->close();
?>