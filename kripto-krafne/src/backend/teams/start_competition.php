<?php
// backend/teams/start_competition.php
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
    $userId = $_SESSION['user_id'] ?? null;
    
    if (!$userId) {
        echo json_encode(['success' => false, 'message' => 'Not authenticated']);
        exit;
    }
    
    // Check if user is admin
    $stmt = $conn->prepare("SELECT is_admin FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    if (!$user || !$user['is_admin']) {
        echo json_encode(['success' => false, 'message' => 'Admin access required']);
        exit;
    }
    
    $data = json_decode(file_get_contents("php://input"), true);
    $durationHours = intval($data['duration_hours'] ?? 24);
    $startNow = $data['start_now'] ?? true;
    
    try {
        $conn->begin_transaction();
        
        // End any active competition
        $stmt = $conn->prepare("UPDATE competition_settings SET is_active = FALSE WHERE is_active = TRUE");
        $stmt->execute();
        
        // Start new competition
        $startTime = $startNow ? date('Y-m-d H:i:s') : null;
        $endTime = $startNow ? date('Y-m-d H:i:s', strtotime("+$durationHours hours")) : null;
        
        $stmt = $conn->prepare("
            INSERT INTO competition_settings 
            (is_active, start_time, end_time, duration_hours, created_by_admin_id, created_at) 
            VALUES (?, ?, ?, ?, ?, NOW())
        ");
        $isActive = $startNow ? 1 : 0;
        $stmt->bind_param("issii", $isActive, $startTime, $endTime, $durationHours, $userId);
        $stmt->execute();
        
        // Reset all team scores for new competition
        if ($startNow) {
            $stmt = $conn->prepare("UPDATE teams SET score = 0, last_solved = NULL");
            $stmt->execute();
            
            $stmt = $conn->prepare("DELETE FROM team_progress");
            $stmt->execute();
        }
        
        $conn->commit();
        
        echo json_encode([
            'success' => true, 
            'message' => $startNow ? 'Competition started!' : 'Competition scheduled',
            'start_time' => $startTime,
            'end_time' => $endTime
        ]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
}

$conn->close();
?>