<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

error_reporting(E_ALL);
ini_set('display_errors', 0);
session_start();
require_once './dbConnection.php';

$userId = $_SESSION['user_id'] ?? null;
if (!$userId) {
    echo json_encode(['show' => false]); exit;
}

// Most recently archived competition (end_competition.php ran for it)
$comp = $conn->query("
    SELECT cs.id, cs.end_time
    FROM competition_settings cs
    WHERE EXISTS (SELECT 1 FROM comp_archive_teams WHERE competition_id = cs.id)
    ORDER BY cs.id DESC LIMIT 1
")->fetch_assoc();

if (!$comp) { echo json_encode(['show' => false]); exit; }

$compId = intval($comp['id']);

// Already seen?
$stmt = $conn->prepare("SELECT 1 FROM user_certificate_seen WHERE user_id = ? AND competition_id = ?");
$stmt->bind_param("ii", $userId, $compId);
$stmt->execute();
if ($stmt->get_result()->fetch_assoc()) { echo json_encode(['show' => false]); exit; }

// User must have participated (in archive)
$stmt = $conn->prepare("SELECT team_id FROM comp_archive_members WHERE competition_id = ? AND user_id = ?");
$stmt->bind_param("ii", $compId, $userId);
$stmt->execute();
$archiveRow = $stmt->get_result()->fetch_assoc();
if (!$archiveRow) { echo json_encode(['show' => false]); exit; }

echo json_encode(['show' => true, 'competition_id' => $compId, 'team_id' => $archiveRow['team_id']]);
$conn->close();
?>
