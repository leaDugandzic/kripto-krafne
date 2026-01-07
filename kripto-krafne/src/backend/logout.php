<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
session_start();

require_once "./dbConnection.php";
unset($_SESSION['username']);
session_destroy();
echo json_encode(["success" => true]);

exit;