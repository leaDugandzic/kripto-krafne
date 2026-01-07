<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
 $servername = "localhost";
 $username = "root";
 $password= "";
 $dbname = "krafne_baza";

 $conn = new mysqli($servername, $username, $password, $dbname);
 if($conn->connect_error){
     die(json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $connection->connect_error
    ]));
 }

?>