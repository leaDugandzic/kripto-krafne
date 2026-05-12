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
if (!$userId) { echo json_encode(['success' => false, 'message' => 'Not authenticated']); exit; }

$data = json_decode(file_get_contents('php://input'), true);
$key  = $data['achievement_key'] ?? '';

if (!$key) { echo json_encode(['success' => false, 'message' => 'Missing achievement_key']); exit; }

$validKeys = [
    'dobrodosao', 'tim_igrac', 'dnevna_doza', 'prva_krafna',
    'secer_i_sol', 'tjedan_krafni', 'slatka_pobjeda', 'brzi_prsti', 'solo_kuhar'
];

if (!in_array($key, $validKeys)) {
    echo json_encode(['success' => false, 'message' => 'Invalid achievement key']);
    exit;
}

// XP rewards per achievement
$xpRewards = [
    'dobrodosao'     => 10,
    'tim_igrac'      => 25,
    'dnevna_doza'    => 30,
    'prva_krafna'    => 50,
    'secer_i_sol'    => 75,
    'tjedan_krafni'  => 100,
    'slatka_pobjeda' => 150,
    'brzi_prsti'     => 200,
    'solo_kuhar'     => 300,
];

// Try to insert — unique constraint prevents duplicates silently
$stmt = $conn->prepare("INSERT IGNORE INTO user_achievements (user_id, achievement_key) VALUES (?, ?)");
$stmt->bind_param("is", $userId, $key);
$stmt->execute();
$wasNew = $stmt->affected_rows > 0;

if ($wasNew) {
    // Grant XP
    $xp = $xpRewards[$key] ?? 0;
    $conn->query("UPDATE users SET xp = xp + $xp WHERE id = $userId");
}

echo json_encode(['success' => true, 'awarded' => $wasNew, 'achievement_key' => $key]);
$conn->close();
?>
