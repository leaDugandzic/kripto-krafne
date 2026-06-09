<?php
// Search users by username (ime)
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
require_once './dbConnection.php';

$userId = $_SESSION['user_id'] ?? null;
if (!$userId) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$q = trim($_GET['q'] ?? '');
if (strlen($q) < 2) {
    echo json_encode(['success' => true, 'users' => []]);
    exit;
}
$team=trim($_GET['team'] ?? '');
$like = '%' . $q . '%';

// Return users who are not already in a team and are not the current user
$stmt = $conn->prepare("
    SELECT u.id, u.ime AS username
    FROM users u
    WHERE u.ime LIKE ?
      AND u.id != ?
      AND u.is_admin = FALSE
     AND u.id NOT IN (SELECT user_id FROM team_members
	  WHERE team_id = (
		  SELECT id
		  FROM teams
		  WHERE name = ?
	  )
  )
    LIMIT 10
");
$stmt->bind_param("sis", $like, $userId, $team);
$stmt->execute();
$users = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

echo json_encode(['success' => true, 'users' => $users]);

$conn->close();
?>
