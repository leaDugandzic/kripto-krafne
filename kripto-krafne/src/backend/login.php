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

    $stmt = $conn->prepare("SELECT id, ime, email, lozinka, is_admin, avatar FROM users WHERE email = ?");
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
        $_SESSION['user_id']  = $user['id'];
        $_SESSION['is_admin'] = $user['is_admin'] ?? 0;
        $_SESSION['avatar']   = $user['avatar'] ?? null;

        $uid   = $user['id'];
        $today = date('Y-m-d');

        // Update streak
        $sRow = $conn->query("SELECT * FROM user_streaks WHERE user_id = $uid")->fetch_assoc();
        if (!$sRow) {
            $conn->query("INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_login_date) VALUES ($uid, 1, 1, '$today')");
            $newStreak = 1;
        } elseif ($sRow['last_login_date'] !== $today) {
            $yesterday = date('Y-m-d', strtotime('-1 day'));
            $newStreak = ($sRow['last_login_date'] === $yesterday) ? $sRow['current_streak'] + 1 : 1;
            $longest   = max($newStreak, $sRow['longest_streak']);
            $conn->query("UPDATE user_streaks SET current_streak=$newStreak, longest_streak=$longest, last_login_date='$today' WHERE user_id=$uid");
        } else {
            $newStreak = $sRow['current_streak'];
        }

        // Helper: award achievement, returns true if newly earned
        $awardNew = function($key, $xp) use ($conn, $uid) {
            $conn->query("INSERT IGNORE INTO user_achievements (user_id, achievement_key) VALUES ($uid, '$key')");
            if ($conn->affected_rows > 0) {
                $conn->query("UPDATE users SET xp = xp + $xp WHERE id = $uid");
                return true;
            }
            return false;
        };

        $newAchievements = [];

        // Retroactively award dobrodosao to all existing users
        if ($awardNew('dobrodosao', 10)) $newAchievements[] = 'dobrodosao';

        // Streak-based achievements
        if ($newStreak >= 3 && $awardNew('dnevna_doza', 30))   $newAchievements[] = 'dnevna_doza';
        if ($newStreak >= 7 && $awardNew('tjedan_krafni', 100)) $newAchievements[] = 'tjedan_krafni';

        echo json_encode([
            "success"          => true,
            "message"          => "Uspješno ste ulogirani",
            "user_id"          => $user['id'],
            "username"         => $user['ime'],
            "is_admin"         => $user['is_admin'] ?? 0,
            "current_streak"   => $newStreak,
            "new_achievements" => $newAchievements,
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