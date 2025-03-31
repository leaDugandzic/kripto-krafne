<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "krafne_baza";
$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8mb4");

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['search']) && !empty(trim($_POST['search']))) {
    $searchQuery = $_POST['search']; // UNSAFE: no escaping of user input
    
    $sql = "SELECT * FROM krafne WHERE ime LIKE '%$searchQuery%'"; 
    
    $result = mysqli_query($conn, $sql);
    
    if ($result && mysqli_num_rows($result) > 0) {
        $items = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode($items);
    } else {
        echo json_encode([]);  
    }
} else {
    echo json_encode(["error" => "No search term provided"]);
}

$conn->close();
?>
