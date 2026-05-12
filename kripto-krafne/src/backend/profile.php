<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

session_start();
require_once './dbConnection.php';

$requestedId = intval($_GET['id'] ?? 0);
if (!$requestedId) {
    echo json_encode(['success' => false, 'message' => 'Missing user id']);
    exit;
}

// ── Basic user info ──────────────────────────────────────────────────────────
$stmt = $conn->prepare("SELECT id, ime, email, xp, created_at, is_admin, avatar FROM users WHERE id = ?");
$stmt->bind_param("i", $requestedId);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if (!$user) {
    echo json_encode(['success' => false, 'message' => 'User not found']);
    exit;
}

// ── Streak ───────────────────────────────────────────────────────────────────
$stmt = $conn->prepare("SELECT current_streak, longest_streak, last_login_date FROM user_streaks WHERE user_id = ?");
$stmt->bind_param("i", $requestedId);
$stmt->execute();
$streak = $stmt->get_result()->fetch_assoc() ?? ['current_streak' => 0, 'longest_streak' => 0, 'last_login_date' => null];

// ── Achievements ─────────────────────────────────────────────────────────────
$stmt = $conn->prepare("SELECT achievement_key, earned_at FROM user_achievements WHERE user_id = ? ORDER BY earned_at ASC");
$stmt->bind_param("i", $requestedId);
$stmt->execute();
$achievements = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// ── Level progress ───────────────────────────────────────────────────────────
$stmt = $conn->prepare("SELECT level_id, completed_at FROM user_level_progress WHERE user_id = ? ORDER BY completed_at ASC");
$stmt->bind_param("i", $requestedId);
$stmt->execute();
$levelProgress = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// ── Team info ────────────────────────────────────────────────────────────────
$stmt = $conn->prepare("
    SELECT t.id, t.name, t.score, tm.is_captain, tm.joined_at
    FROM team_members tm
    JOIN teams t ON tm.team_id = t.id
    WHERE tm.user_id = ?
");
$stmt->bind_param("i", $requestedId);
$stmt->execute();
$team = $stmt->get_result()->fetch_assoc();

// ── CTF solves ───────────────────────────────────────────────────────────────
$ctfSolves = 0;
if ($team) {
    $stmt = $conn->prepare("SELECT COUNT(*) as cnt FROM team_progress WHERE solved_by_user_id = ?");
    $stmt->bind_param("i", $requestedId);
    $stmt->execute();
    $ctfSolves = $stmt->get_result()->fetch_assoc()['cnt'];
}

// ── Is viewing own profile ────────────────────────────────────────────────────
$viewerIsOwner = isset($_SESSION['user_id']) && $_SESSION['user_id'] == $requestedId;

echo json_encode([
    'success'        => true,
    'user'           => [
        'id'         => $user['id'],
        'name'       => $user['ime'],
        'email'      => $viewerIsOwner ? $user['email'] : null,
        'xp'         => intval($user['xp']),
        'is_admin'   => (bool)$user['is_admin'],
        'created_at' => $user['created_at'],
        'avatar'     => $user['avatar'],
    ],
    'streak'         => [
        'current'    => intval($streak['current_streak']),
        'longest'    => intval($streak['longest_streak']),
        'last_login' => $streak['last_login_date'],
    ],
    'achievements'   => $achievements,
    'level_progress' => $levelProgress,
    'levels_done'    => count($levelProgress),
    'ctf_solves'     => intval($ctfSolves),
    'team'           => $team,
    'is_own_profile' => $viewerIsOwner,
]);

$conn->close();
?>
