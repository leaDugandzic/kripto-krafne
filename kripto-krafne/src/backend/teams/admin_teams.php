<?php
// Admin: list all teams with members + ban/delete
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../dbConnection.php';

$userId = $_SESSION['user_id'] ?? null;
if (!$userId) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$stmt = $conn->prepare("SELECT is_admin FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if (!$user || !$user['is_admin']) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Admin access required']);
    exit;
}

// ── GET: list all teams ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $conn->prepare("
        SELECT
            t.id,
            t.name AS team_name,
            t.score,
            t.created_at,
            t.last_solved,
            COUNT(DISTINCT tm.user_id)    AS member_count,
            (SELECT COUNT(*) FROM team_progress tp WHERE tp.team_id = t.id) AS tasks_solved
        FROM teams t
        LEFT JOIN team_members tm ON t.id = tm.team_id
        GROUP BY t.id
        ORDER BY t.score DESC, t.last_solved ASC
    ");

    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Query prepare failed: ' . $conn->error]);
        exit;
    }

    if (!$stmt->execute()) {
        echo json_encode(['success' => false, 'message' => 'Query execute failed: ' . $stmt->error]);
        exit;
    }

    $teams = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    // Attach members to each team
    foreach ($teams as &$team) {
        $s2 = $conn->prepare("
            SELECT u.id, u.ime AS username, u.email, u.is_banned, tm.is_captain, tm.joined_at
            FROM team_members tm
            JOIN users u ON tm.user_id = u.id
            WHERE tm.team_id = ?
            ORDER BY tm.is_captain DESC, tm.joined_at ASC
        ");
        if ($s2) {
            $s2->bind_param("i", $team['id']);
            $s2->execute();
            $team['members'] = $s2->get_result()->fetch_all(MYSQLI_ASSOC);
        } else {
            $team['members'] = [];
        }
    }
    unset($team);

    echo json_encode(['success' => true, 'teams' => $teams]);
    exit;
}

// ── POST: admin actions ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data   = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'] ?? '';

    // Delete team
    if ($action === 'delete_team') {
        $teamId = intval($data['team_id'] ?? 0);
        if (!$teamId) {
            echo json_encode(['success' => false, 'message' => 'Missing team_id']);
            exit;
        }
        // Cascading deletes require FK cascade, otherwise delete manually:
        $conn->begin_transaction();
        try {
            $conn->query("DELETE FROM team_progress   WHERE team_id = $teamId");
            $conn->query("DELETE FROM invitations     WHERE team_id = $teamId");
            $conn->query("DELETE FROM team_members    WHERE team_id = $teamId");
            $conn->query("DELETE FROM teams           WHERE id      = $teamId");
            $conn->commit();
            echo json_encode(['success' => true, 'message' => 'Team deleted']);
        } catch (Exception $e) {
            $conn->rollback();
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        exit;
    }

    // Ban / unban player
    if ($action === 'ban_player' || $action === 'unban_player') {
        $targetId = intval($data['user_id'] ?? 0);
        if (!$targetId) {
            echo json_encode(['success' => false, 'message' => 'Missing user_id']);
            exit;
        }
        $banned = $action === 'ban_player' ? 1 : 0;
        $stmt = $conn->prepare("UPDATE users SET is_banned = ? WHERE id = ?");
        $stmt->bind_param("ii", $banned, $targetId);
        $stmt->execute();
        $verb = $banned ? 'banned' : 'unbanned';
        echo json_encode(['success' => true, 'message' => "Player $verb successfully"]);
        exit;
    }

    echo json_encode(['success' => false, 'message' => 'Unknown action']);
}

$conn->close();
?>
