<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
require_once '../dbConnection.php';
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = $_SESSION['user_id'] ?? null;
    
    if (!$userId) {
        echo json_encode(['success' => false, 'message' => 'Not authenticated']);
        exit;
    }
    
    // Get user's team
    $stmt = $conn->prepare("SELECT team_id, is_captain FROM team_members WHERE user_id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $member = $result->fetch_assoc();
    
    if (!$member) {
        echo json_encode(['success' => false, 'message' => 'Not in a team']);
        exit;
    }
    
    $teamId = $member['team_id'];
    $isCaptain = $member['is_captain'];
    
    // If captain, disband team if it's the last member
    if ($isCaptain) {
        // Count team members
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM team_members WHERE team_id = ?");
        $stmt->bind_param("i", $teamId);
        $stmt->execute();
        $result = $stmt->get_result();
        $count = $result->fetch_assoc()['count'];
        
        if ($count > 1) {
            echo json_encode(['success' => false, 'message' => 'Captain cannot leave. Transfer captaincy first or disband team.']);
            exit;
        } else {
            // Delete team (cascade will delete team_members and progress)
            $stmt = $conn->prepare("DELETE FROM teams WHERE id = ?");
            $stmt->bind_param("i", $teamId);
            $stmt->execute();
        }
    } else {
        // Regular member - just remove
        $stmt = $conn->prepare("DELETE FROM team_members WHERE user_id = ? AND team_id = ?");
        $stmt->bind_param("ii", $userId, $teamId);
        $stmt->execute();
    }
    
    echo json_encode(['success' => true, 'message' => 'Left team successfully']);
}
?>