<?php
header('Access-Control-Allow-Origin: http://localhost:5173');  
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

require_once "./dbConnection.php";

if($_SERVER["REQUEST_METHOD"] == "OPTIONS"){
    http_response_code(200);
    exit();
}

$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
$category_id = isset($_GET['category_id']) ? intval($_GET['category_id']) : null;
$search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : null;

$offset = ($page - 1) * $limit;

// Build WHERE clause
$whereConditions = [];
$params = [];
$types = "";

if ($category_id) {
    $whereConditions[] = "bp.category_id = ?";
    $params[] = $category_id;
    $types .= "i";
}

if ($search) {
    $whereConditions[] = "(bp.title LIKE ? OR bp.content LIKE ?)";
    $params[] = "%$search%";
    $params[] = "%$search%";
    $types .= "ss";
}

$whereClause = "";
if (!empty($whereConditions)) {
    $whereClause = "WHERE " . implode(" AND ", $whereConditions);
}

try {
    // Get total count
    $countSql = "SELECT COUNT(*) as total FROM blog_posts bp $whereClause";
    if (!empty($params)) {
        $countStmt = $conn->prepare($countSql);
        $countStmt->bind_param($types, ...$params);
        $countStmt->execute();
        $countResult = $countStmt->get_result();
        $totalPosts = $countResult->fetch_assoc()['total'];
        $countStmt->close();
    } else {
        $countResult = $conn->query($countSql);
        $totalPosts = $countResult->fetch_assoc()['total'];
    }
    
    // Get posts
    $sql = "SELECT 
                bp.id,
                bp.title,
                bp.user_id,
                bp.content,
                bp.publish_date,
                bp.category_id,
                c.category_name
            FROM blog_posts bp
            LEFT JOIN category c ON bp.category_id = c.id
            $whereClause
            ORDER BY bp.publish_date DESC
            LIMIT ? OFFSET ?";
    
    $stmt = $conn->prepare($sql);
    
    // Add limit and offset parameters
    $limitParams = [$limit, $offset];
    $limitTypes = "ii";
    
    if (!empty($params)) {
        // If we have existing params, combine them with limit params
        $allParams = array_merge($params, $limitParams);
        $allTypes = $types . $limitTypes;
        $stmt->bind_param($allTypes, ...$allParams);
    } else {
        // If no existing params, just use limit params
        $stmt->bind_param($limitTypes, ...$limitParams);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $posts = [];
    while($row = $result->fetch_assoc()) {
        $posts[] = $row;
    }
    
    $stmt->close();
    
    echo json_encode([
        'success' => true,
        'posts' => $posts,
        'pagination' => [
            'current_page' => $page,
            'total_posts' => $totalPosts,
            'total_pages' => ceil($totalPosts / $limit),
            'posts_per_page' => $limit
        ]
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
?>