<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
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

if (isset($data["token"])) {
    $token = $data["token"];
    $client_id = "952913949861-jmuevt7ajs4ao9mst0eo6lnau14c8k3k.apps.googleusercontent.com";
    $url = "https://oauth2.googleapis.com/tokeninfo?id_token=" . $token;
    $response = file_get_contents($url);
    $googleData = json_decode($response, true);

    if (!isset($googleData["email"])) {
        echo json_encode(["success" => false, "message" => "Invalid Google token."]);
        exit;
    }

    $email = $googleData["email"];
    $name = $googleData["name"] ?? "Google User";

    $stmt = $conn->prepare("SELECT * FROM users WHERE Email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $insert = $conn->prepare("INSERT INTO users (Ime, Email, Lozinka) VALUES (?, ?, '')");
        $insert->bind_param("ss", $name, $email);
        $insert->execute();
        $insert->close();
    }
    session_start();
    $_SESSION['username'] = $name;
    echo json_encode(["success" => true, "message" => "Google login successful."]);
    $stmt->close();
    $conn->close();
    exit;
}

if (isset($data["Email"]) && isset($data["Password"])) {
    $email = $data["Email"];
    $password = $data["Password"];

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();

    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Nema korisnika pod tim e-mailom"]);
        exit;
    }

    $user = $result->fetch_assoc();
    if (password_verify($password, $user["lozinka"])) {
        session_start();
        $_SESSION['username'] = $user['ime'];
        echo json_encode(["success" => true, "message" => "Uspješno ste ulogirani"]);
    } else {
        echo json_encode(["success" => false, "message" => "Netočna lozinka. Molim vas pokušajte ponovno."]);
    }
    $stmt->close();
    $conn->close();
}
