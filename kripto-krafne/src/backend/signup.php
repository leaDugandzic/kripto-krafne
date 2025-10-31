<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");    

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
require_once "./dbConnection.php";
    $encodedData = file_get_contents("php://input");
    $data = json_decode($encodedData, true);
    if($data){
        $email = $data["Email"];
        $password = $data["Password"];
        $ime = $data["Ime"];

       try {
        $query = $conn->prepare("INSERT INTO users (ime, email, lozinka) VALUES (?, ?, ?)");
        $query->execute([$ime, $email, $password]);

        echo json_encode(["success" => true, "message" => "User registered successfully"]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }
    } else {
    echo json_encode(["success" => false, "message" => "No data received"]);
}



?>