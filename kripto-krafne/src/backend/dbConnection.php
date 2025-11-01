<?php
header("Access-Control-Allow-Credentials: true");

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