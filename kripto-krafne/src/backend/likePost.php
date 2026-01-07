<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

require_once "./dbConnection.php";
session_start();

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['post_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Nedostaje post_id"
    ]);
    exit;
}

$userId = $_SESSION['username'] ?? null;
$postId = intval($data['post_id']);

if (!$userId) {
    echo json_encode([
        "success" => false,
        "message" => "Niste prijavljeni"
    ]);
    exit;
}

try {
    $check = $conn->prepare(
        "SELECT id FROM likes WHERE post_id = ? AND user_id = ?"
    );
    $check->bind_param("is", $postId, $userId);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        $delete = $conn->prepare(
            "DELETE FROM likes WHERE post_id = ? AND user_id = ?"
        );
        $delete->bind_param("is", $postId, $userId);
        $delete->execute();
        $delete->close();

        $action = "unliked";
    } else {
        $insert = $conn->prepare(
            "INSERT INTO likes (post_id, user_id) VALUES (?, ?)"
        );
        $insert->bind_param("is", $postId, $userId);
        $insert->execute();
        $insert->close();

        $action = "liked";
    }

    $check->close();

    $count = $conn->prepare(
        "SELECT COUNT(*) AS likes FROM likes WHERE post_id = ?"
    );
    $count->bind_param("i", $postId);
    $count->execute();
    $result = $count->get_result()->fetch_assoc();
    $count->close();

    echo json_encode([
        "success" => true,
        "action" => $action,
        "likes" => (int)$result['likes']
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Greška na serveru"
    ]);
}
