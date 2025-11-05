<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

session_start();

if (isset($_SESSION['username'])) {
    echo json_encode(["loggedIn" => true, "username" => $_SESSION['username']]);
} else {
    echo json_encode(["loggedIn" => false]);
}
?>