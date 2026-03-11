<?php
// backend/login.php
// Headers MUST come before any output
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Turn off error display to prevent breaking JSON
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

session_start();
require_once "./dbConnection.php";

$encodedData = file_get_contents("php://input");
$data = json_decode($encodedData, true);

// Google OAuth Login
if (isset($data["token"])) {
    $token = $data["token"];
    $url = "https://oauth2.googleapis.com/tokeninfo?id_token=" . $token;
    $response = file_get_contents($url);
    $googleData = json_decode($response, true);

    if (!isset($googleData["email"])) {
        echo json_encode(["success" => false, "message" => "Invalid Google token."]);
        exit;
    }

    $email = $googleData["email"];
    $name = $googleData["name"] ?? "Google User";

    $stmt = $conn->prepare("SELECT id, ime FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        // Create new user
        $insert = $conn->prepare("INSERT INTO users (ime, email, lozinka) VALUES (?, ?, '')");
        $insert->bind_param("ss", $name, $email);
        $insert->execute();
        $userId = $conn->insert_id;
        $insert->close();
    } else {
        $user = $result->fetch_assoc();
        $userId = $user['id'];
        $name = $user['ime'];
    }

    $_SESSION['username'] = $name;
    $_SESSION['user_id'] = $userId;
    
    echo json_encode([
        "success" => true, 
        "message" => "Google login successful.",
        "user_id" => $userId,
        "username" => $name
    ]);
    $stmt->close();
    $conn->close();
    exit;
}

// Regular Email/Password Login
if (isset($data["Email"]) && isset($data["Password"])) {
    $email = $data["Email"];
    $password = $data["Password"];

    $stmt = $conn->prepare("SELECT id, ime, email, lozinka, is_admin FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Nema korisnika pod tim e-mailom"]);
        $stmt->close();
        $conn->close();
        exit;
    }

    $user = $result->fetch_assoc();
    
    if (password_verify($password, $user["lozinka"])) {
        $_SESSION['username'] = $user['ime'];
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['is_admin'] = $user['is_admin'] ?? 0;
        
        echo json_encode([
            "success" => true, 
            "message" => "Uspješno ste ulogirani",
            "user_id" => $user['id'],
            "username" => $user['ime'],
            "is_admin" => $user['is_admin'] ?? 0
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Netočna lozinka. Molim vas pokušajte ponovno."]);
    }
    
    $stmt->close();
    $conn->close();
    exit;
}

// If no valid data provided
echo json_encode(["success" => false, "message" => "Invalid request"]);
$conn->close();
?>