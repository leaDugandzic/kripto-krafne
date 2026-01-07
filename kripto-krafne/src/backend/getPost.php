<?php
header('Access-Control-Allow-Origin: http://localhost:5173');  
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

require_once "./dbConnection.php";
session_start();

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    http_response_code(200);
    exit();
}

$post_id = isset($_GET['post_id']) ? intval($_GET['post_id']) : null;
$userId = $_SESSION['username'] ?? null;

if (!$post_id) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'ID posta je obavezan'
    ]);
    exit();
}

try {
    $sql = "
        SELECT 
            bp.id,
            bp.title,
            bp.user_id,
            bp.content,
            bp.publish_date,
            bp.category_id,
            c.category_name,

            (
                SELECT COUNT(*) 
                FROM likes pl 
                WHERE pl.post_id = bp.id
            ) AS likes,

            (
                SELECT COUNT(*) 
                FROM likes pl 
                WHERE pl.post_id = bp.id AND pl.user_id = ?
            ) AS liked

        FROM blog_posts bp
        LEFT JOIN category c ON bp.category_id = c.id
        WHERE bp.id = ?
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $userId, $post_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Post nije pronađen'
        ]);
        exit();
    }

    $post = $result->fetch_assoc();

    $post['likes'] = (int)$post['likes'];
    $post['liked'] = (bool)$post['liked'];

    $stmt->close();

    echo json_encode([
        'success' => true,
        'post' => $post
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
} finally {
    $conn->close();
}
