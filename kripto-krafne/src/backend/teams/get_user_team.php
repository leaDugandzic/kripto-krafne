<?php
// backend/teams/get_user_team.php
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
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once '../dbConnection.php';

// Check authentication
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false, 
        'message' => 'User not authenticated'
    ]);
    exit;
}

$userId = $_SESSION['user_id'];

// Get user's team
$stmt = $conn->prepare("
    SELECT t.*, tm.is_captain 
    FROM teams t
    JOIN team_members tm ON t.id = tm.team_id
    WHERE tm.user_id = ?
");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();
$team = $result->fetch_assoc();

if ($team) {
    // Get team members
    $stmt = $conn->prepare("
        SELECT u.id, u.ime as username, u.email, tm.is_captain, tm.joined_at
        FROM team_members tm
        JOIN users u ON tm.user_id = u.id
        WHERE tm.team_id = ?
        ORDER BY tm.is_captain DESC, tm.joined_at ASC
    ");
    $stmt->bind_param("i", $team['id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $members = $result->fetch_all(MYSQLI_ASSOC);

    // Get team progress
    $stmt = $conn->prepare("
        SELECT tp.task_number, tp.solved_at, tp.code, tp.solved_by_user_id, u.ime AS solved_by_username
        FROM team_progress tp
        LEFT JOIN users u ON tp.solved_by_user_id = u.id
        WHERE tp.team_id = ?
        ORDER BY tp.task_number ASC
    ");
    $stmt->bind_param("i", $team['id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $progress = $result->fetch_all(MYSQLI_ASSOC);

    // Get pending invitations sent by this team
    $stmt = $conn->prepare("
        SELECT i.id, u.ime as to_user, i.created_at
        FROM invitations i
        JOIN users u ON i.to_user_id = u.id
        WHERE i.team_id = ? AND i.status = 'pending'
    ");
    $stmt->bind_param("i", $team['id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $sentInvitations = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        'success' => true,
        'team' => $team,
        'members' => $members,
        'progress' => $progress,
        'sent_invitations' => $sentInvitations,
        'in_team' => true
    ]);
} else {
    // Check for pending invitations
    $stmt = $conn->prepare("
        SELECT i.id, t.name as team_name, u.ime as from_user, i.created_at
        FROM invitations i
        JOIN teams t ON i.team_id = t.id
        JOIN users u ON i.from_user_id = u.id
        WHERE i.to_user_id = ? AND i.status = 'pending'
    ");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $invitations = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        'success' => true,
        'in_team' => false,
        'invitations' => $invitations
    ]);
}

$conn->close();
?>