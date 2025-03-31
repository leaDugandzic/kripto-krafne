<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "krafne_baza";

$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['search'])) {
        $search = '%' . $_GET['search'] . '%';
        $stmt = $conn->prepare("SELECT * FROM krafne WHERE ime LIKE ?");
        $stmt->bind_param('s', $search);
        $stmt->execute();
        $result = $stmt->get_result();
        $items = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($items);
    } else {
        $result = $conn->query("SELECT * FROM krafne");
        $items = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($items);
    }
}
?>