<?php
// backend/leaderboard.php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once './dbConnection.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $limit = intval($_GET['limit'] ?? 20);
    
    $stmt = $conn->prepare("
        SELECT 
            t.id,
            t.name as team_name,
            t.score,
            t.last_solved,
            COUNT(DISTINCT tm.user_id) as member_count,
            GROUP_CONCAT(DISTINCT u.ime ORDER BY tm.joined_at ASC SEPARATOR ', ') as members,
            (SELECT COUNT(*) FROM team_progress tp WHERE tp.team_id = t.id) as tasks_solved
        FROM teams t
        LEFT JOIN team_members tm ON t.id = tm.team_id
        LEFT JOIN users u ON tm.user_id = u.id
        GROUP BY t.id
        ORDER BY 
            t.score DESC,
            t.last_solved ASC,
            t.created_at ASC
        LIMIT ?
    ");
    $stmt->bind_param("i", $limit);
    $stmt->execute();
    $result = $stmt->get_result();
    $teams = $result->fetch_all(MYSQLI_ASSOC);
    
    // Get competition status
    $stmt = $conn->prepare("SELECT * FROM competition_settings WHERE is_active = TRUE ORDER BY id DESC LIMIT 1");
    $stmt->execute();
    $result = $stmt->get_result();
    $competition = $result->fetch_assoc();
    
    echo json_encode([
        'success' => true,
        'teams' => $teams,
        'competition' => $competition,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}

$conn->close();
?>