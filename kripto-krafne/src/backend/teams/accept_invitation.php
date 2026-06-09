<?php
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
    $userId = $_SESSION['user_id'] ?? null;
    $invitationId = $data['invitation_id'] ?? null;
    $accept = $data['accept'] ?? true;

    if (!$userId) {
        echo json_encode(['success' => false, 'message' => 'Not authenticated']);
        exit;
    }

    if (!$invitationId) {
        echo json_encode(['success' => false, 'message' => 'Missing invitation ID']);
        exit;
    }

    // Get invitation
    $stmt = $conn->prepare("SELECT * FROM invitations WHERE id = ? AND to_user_id = ? AND status = 'pending'");
    $stmt->bind_param("ii", $invitationId, $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $invitation = $result->fetch_assoc();

    if (!$invitation) {
        echo json_encode(['success' => false, 'message' => 'Invalid invitation']);
        exit;
    }

    $teamId = $invitation['team_id'];

    if ($accept) {
        // Check team size
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM team_members WHERE team_id = ?");
        $stmt->bind_param("i", $teamId);
        $stmt->execute();
        $result = $stmt->get_result();
        $teamSize = $result->fetch_assoc()['count'];

        if ($teamSize >= 4) {
            // Update invitation to declined
            $stmt = $conn->prepare("UPDATE invitations SET status = 'declined' WHERE id = ?");
            $stmt->bind_param("i", $invitationId);
            $stmt->execute();

            echo json_encode(['success' => false, 'message' => 'Team is now full']);
            exit;
        }

        try {
            $conn->begin_transaction();

            // Add user to team
            $stmt = $conn->prepare("INSERT INTO team_members (team_id, user_id, is_captain, joined_at) VALUES (?, ?, FALSE, NOW())");
            $stmt->bind_param("ii", $teamId, $userId);
            $stmt->execute();

            // Update invitation
            $stmt = $conn->prepare("UPDATE invitations SET status = 'accepted' WHERE id = ?");
            $stmt->bind_param("i", $invitationId);
            $stmt->execute();

            // Decline all other pending invitations for this user
            $stmt = $conn->prepare("UPDATE invitations SET status = 'declined' WHERE to_user_id = ? AND status = 'pending' AND id != ?");
            $stmt->bind_param("ii", $userId, $invitationId);
            $stmt->execute();

            $conn->commit();

            // Award tim_igrac achievement
            $conn->query("INSERT IGNORE INTO user_achievements (user_id, achievement_key) VALUES ($userId, 'tim_igrac')");
            if ($conn->affected_rows > 0) {
                $conn->query("UPDATE users SET xp = xp + 25 WHERE id = $userId");
            }

            echo json_encode(['success' => true, 'message' => 'Joined team successfully']);
        } catch (Exception $e) {
            $conn->rollback();
            echo json_encode(['success' => false, 'message' => 'Error joining team: ' . $e->getMessage()]);
        }
    } else {
        // Decline invitation
        $stmt = $conn->prepare("UPDATE invitations SET status = 'declined' WHERE id = ?");
        $stmt->bind_param("i", $invitationId);
        $stmt->execute();

        echo json_encode(['success' => true, 'message' => 'Invitation declined']);
    }
}

$conn->close();
?>
