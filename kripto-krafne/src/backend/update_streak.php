<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

error_reporting(E_ALL);
ini_set('display_errors', 0);

session_start();
require_once './dbConnection.php';

$userId = $_SESSION['user_id'] ?? null;
if (!$userId) { echo json_encode(['success' => false]); exit; }

$today = date('Y-m-d');

// Get or create streak row
$stmt = $conn->prepare("SELECT * FROM user_streaks WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$streak = $stmt->get_result()->fetch_assoc();

if (!$streak) {
    // First ever login
    $stmt = $conn->prepare("INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_login_date) VALUES (?, 1, 1, ?)");
    $stmt->bind_param("is", $userId, $today);
    $stmt->execute();
    echo json_encode(['success' => true, 'current_streak' => 1, 'new_day' => true]);
    exit;
}

if ($streak['last_login_date'] === $today) {
    // Already logged in today — no change
    echo json_encode(['success' => true, 'current_streak' => $streak['current_streak'], 'new_day' => false]);
    exit;
}

$yesterday = date('Y-m-d', strtotime('-1 day'));
if ($streak['last_login_date'] === $yesterday) {
    // Consecutive day — extend streak
    $newStreak = $streak['current_streak'] + 1;
    $longest   = max($newStreak, $streak['longest_streak']);
} else {
    // Missed a day — reset
    $newStreak = 1;
    $longest   = $streak['longest_streak'];
}

$stmt = $conn->prepare("UPDATE user_streaks SET current_streak = ?, longest_streak = ?, last_login_date = ? WHERE user_id = ?");
$stmt->bind_param("iisi", $newStreak, $longest, $today, $userId);
$stmt->execute();

echo json_encode(['success' => true, 'current_streak' => $newStreak, 'new_day' => true]);
$conn->close();
?>
