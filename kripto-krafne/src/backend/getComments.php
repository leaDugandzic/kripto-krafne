<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
require_once "./dbConnection.php";

$postId = $_GET['post_id'] ?? null;

if (!$postId) {
    echo json_encode(["success" => false, "message" => "Nedostaje post_id"]);
    exit;
}

$stmt = $conn->prepare("
    SELECT id, user_id, content, created_at
    FROM comments
    WHERE post_id = ?
    ORDER BY created_at DESC
");

$stmt->bind_param("i", $postId);
$stmt->execute();

$result = $stmt->get_result();
$comments = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode([
    "success" => true,
    "comments" => $comments
]);
