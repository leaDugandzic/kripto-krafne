<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

require_once "./dbConnection.php";

session_start();

$encodedData = file_get_contents("php://input");
$data = json_decode($encodedData, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Nema podataka"]);
    exit;
}

$naslov = $data["Naslov"] ?? "";
$opis = $data["Opis"] ?? "";
$kategorija = $data["Kategorija"] ?? "";

$userId = $_SESSION['user_id'] ?? null;

if (!$userId) {
    echo json_encode(["success" => false, "message" => "Niste prijavljeni."]);
    exit;
}

if (empty($naslov) || empty($opis) || empty($kategorija)) {
    echo json_encode(["success" => false, "message" => "Sva polja su obavezna."]);
    exit;
}

try {
    $query = $conn->prepare("
        INSERT INTO blog_posts (title, user_id, content, category_id)
        VALUES (?, ?, ?, ?)
    ");
    $query->bind_param("sisi", $naslov, $userId, $opis, $kategorija);

    if ($query->execute()) {
        echo json_encode(["success" => true, "message" => "Post objavljen uspješno"]);
    } else {
        echo json_encode(["success" => false, "message" => "Greška pri obradi upita"]);
    }

    $query->close();
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Greška pri spajanju na bazu"]);
}

exit;
