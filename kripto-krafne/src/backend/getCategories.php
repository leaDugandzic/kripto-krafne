<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once "./dbConnection.php";

$result = $conn->query("SELECT id, category_name FROM category ORDER BY id ASC");

$rows = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($rows);
exit;
