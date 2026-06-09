<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "krafne_baza";

$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$search = $_POST['search'] ?? ($_GET['search'] ?? '');

$upit = "SELECT * FROM krafne WHERE ime LIKE '%$search%'";
$rezultat = mysqli_query($conn, $upit);

if ($rezultat && mysqli_num_rows($rezultat) > 0) {
    $items = mysqli_fetch_all($rezultat, MYSQLI_ASSOC);
    echo json_encode($items);
} else {
    echo json_encode([]);
}

$conn->close();
?>
