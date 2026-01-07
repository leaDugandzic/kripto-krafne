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
if ($data) {
    $email = $data["Email"];
    $password = $data["Password"];
    $ime = $data["Ime"];
    $confPass = $data["ConfirmPass"];

    if (empty($email) || empty($ime) || empty($password) || empty($confPass)) {
        echo json_encode(["success" => false, "message" => "Sva polja su obavezna."]);
        exit;
    }
    $pattern = '/^(?=.*[0-9])(?=.*[A-Z]).{8,24}$/';

    if (!preg_match($pattern, $password)) {
        echo json_encode(["success" => false, "message" => "Lozink mora saržavati barem 1 veliko slovo, 1 broj i imati više od 8 znakova."]);
        exit;
    }
    if ($password != $confPass) {
        echo json_encode(["success" => false, "message" => "Lozinke se ne podudaraju."]);
        exit;
    }
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
        echo json_encode(["success" => false, "message" => "Email nije validan."]);
        exit;
    }
    try {
        $checkMail = $conn->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
        $checkMail->bind_param("s", $email);
        $checkMail->execute();
        $checkMail->bind_result($emailExists);
        $checkMail->fetch();
        $checkMail->close();

        if ($emailExists > 0) {
            echo json_encode(["success" => false, "message" => "Email već postoji."]);
            exit;
        }
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $query = $conn->prepare("INSERT INTO users (ime, email, lozinka) VALUES (?, ?, ?)");
        $query->bind_param("sss", $ime,$email,$hashedPassword);
        $uspjeh = $query->execute();
        $query->close();

        if($uspjeh){
        echo json_encode(["success" => true, "message" => "User registered successfully"]);

        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "No data received"]);
}
