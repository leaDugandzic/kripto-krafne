<?php
// backend/teams/invite.php
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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $fromUserId = $_SESSION['user_id'] ?? null;
    $toUsername = trim($data['to_username'] ?? '');
    $teamId = $data['team_id'] ?? null;
    
    if (!$fromUserId) {
        echo json_encode(['success' => false, 'message' => 'Not authenticated']);
        exit;
    }
    
    if (empty($toUsername) || !$teamId) {
        echo json_encode(['success' => false, 'message' => 'Missing parameters']);
        exit;
    }
    
    // Check if user is team captain
    $stmt = $conn->prepare("SELECT is_captain FROM team_members WHERE team_id = ? AND user_id = ?");
    $stmt->bind_param("ii", $teamId, $fromUserId);
    $stmt->execute();
    $result = $stmt->get_result();
    $member = $result->fetch_assoc();
    
    if (!$member || !$member['is_captain']) {
        echo json_encode(['success' => false, 'message' => 'Only team captain can invite']);
        exit;
    }
    
    // Check team size
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM team_members WHERE team_id = ?");
    $stmt->bind_param("i", $teamId);
    $stmt->execute();
    $result = $stmt->get_result();
    $teamSize = $result->fetch_assoc()['count'];
    
    if ($teamSize >= 4) {
        echo json_encode(['success' => false, 'message' => 'Team is full (max 4 members)']);
        exit;
    }
    
    // Find user by username
    $stmt = $conn->prepare("SELECT id FROM users WHERE ime = ?");
    $stmt->bind_param("s", $toUsername);
    $stmt->execute();
    $result = $stmt->get_result();
    $toUser = $result->fetch_assoc();
    
    if (!$toUser) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }
    
    $toUserId = $toUser['id'];
    
    // Check if user is already in a team
    $stmt = $conn->prepare("SELECT team_id FROM team_members WHERE user_id = ?");
    $stmt->bind_param("i", $toUserId);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'User is already in a team']);
        exit;
    }
    
    // Check if invitation already exists
    $stmt = $conn->prepare("SELECT id FROM invitations WHERE team_id = ? AND to_user_id = ? AND status = 'pending'");
    $stmt->bind_param("ii", $teamId, $toUserId);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Invitation already sent']);
        exit;
    }
    
    // Create invitation
    $stmt = $conn->prepare("INSERT INTO invitations (team_id, from_user_id, to_user_id, status, created_at) VALUES (?, ?, ?, 'pending', NOW())");
    $stmt->bind_param("iii", $teamId, $fromUserId, $toUserId);
    $stmt->execute();
    
    echo json_encode([
        'success' => true, 
        'message' => 'Invitation sent successfully',
        'invitation_id' => $conn->insert_id
    ]);
}

$conn->close();
?>