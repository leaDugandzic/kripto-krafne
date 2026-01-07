<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "krafne_baza";

$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$row_count_result = mysqli_query($conn, "SELECT COUNT(*) as total FROM krafne");
$row_count = mysqli_fetch_assoc($row_count_result)['total'];

$limit = $row_count - 1;

$upit = "SELECT * FROM krafne ORDER BY id ASC LIMIT $limit";
$rezultat = mysqli_query($conn, $upit);

if ($rezultat && mysqli_num_rows($rezultat) > 0) {
    $items = mysqli_fetch_all($rezultat, MYSQLI_ASSOC); 
    echo json_encode($items); 
} else {
    echo json_encode(["error" => "No data found in krafne table"]);
}

$conn->close();
?>
