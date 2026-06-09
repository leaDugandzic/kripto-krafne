<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
require_once '../dbConnection.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$data       = json_decode(file_get_contents("php://input"), true);
$userId     = $_SESSION['user_id'] ?? null;
$taskNumber = intval($data['task_number'] ?? 0);
$code       = strtolower(trim($data['code'] ?? ''));

if (!$userId) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

if (!$taskNumber || empty($code)) {
    echo json_encode(['success' => false, 'message' => 'Missing parameters']);
    exit;
}

// Check if user is in a team
$stmt = $conn->prepare("SELECT team_id FROM team_members WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$teamMember = $stmt->get_result()->fetch_assoc();

if (!$teamMember) {
    echo json_encode(['success' => false, 'message' => 'You must be in a team to submit answers.']);
    exit;
}

$teamId = $teamMember['team_id'];

// Check competition is active AND not expired
$stmt = $conn->prepare("
    SELECT id, start_time, end_time FROM competition_settings
    WHERE is_active = TRUE AND end_time > NOW()
    LIMIT 1
");
$stmt->execute();
$competition = $stmt->get_result()->fetch_assoc();

if (!$competition) {
    // Auto-deactivate any expired competitions
    $conn->query("UPDATE competition_settings SET is_active = FALSE WHERE end_time <= NOW()");
    echo json_encode(['success' => false, 'message' => 'Competition is not active or has ended.']);
    exit;
}

// Check if task already solved by this team
$stmt = $conn->prepare("SELECT id FROM team_progress WHERE team_id = ? AND task_number = ?");
$stmt->bind_param("ii", $teamId, $taskNumber);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Your team has already solved this task!']);
    exit;
}

// Validate code (lowercase comparison — matches DonutGame.jsx flag strings)
$validCodes = [
    1 => 'krafna{gl4z3d_s3cur1ty}',
    2 => 'krafna{d0ughnut_h4x}',
    3 => 'krafna{3ncrypt3d_j3ly}',
    4 => 'krafna{5ug4r_5pr1nkl3}',
    5 => 'krafna{c1nnam0n_r0ll}',
    6 => 'krafna{f1ll3d_w1th_fl4g}',
];

if (!isset($validCodes[$taskNumber]) || $code !== $validCodes[$taskNumber]) {
    echo json_encode(['success' => false, 'message' => 'Invalid code. Try again!']);
    exit;
}

// Record success
try {
    $conn->begin_transaction();

    $stmt = $conn->prepare("INSERT INTO team_progress (team_id, task_number, solved_by_user_id, code, solved_at) VALUES (?, ?, ?, ?, NOW())");
    $stmt->bind_param("iiis", $teamId, $taskNumber, $userId, $code);
    $stmt->execute();

    $taskPoints = [1 => 200, 2 => 80, 3 => 100, 4 => 50, 5 => 100, 6 => 150];
    $points = $taskPoints[$taskNumber] ?? 100;

    $stmt = $conn->prepare("UPDATE teams SET score = score + ?, last_solved = NOW() WHERE id = ?");
    $stmt->bind_param("ii", $points, $teamId);
    $stmt->execute();

    // +100 XP to solving user
    $conn->query("UPDATE users SET xp = xp + 100 WHERE id = $userId");

    $conn->commit();

    // Return updated score
    $stmt = $conn->prepare("SELECT score FROM teams WHERE id = ?");
    $stmt->bind_param("i", $teamId);
    $stmt->execute();
    $teamScore = $stmt->get_result()->fetch_assoc()['score'];

    $stmt = $conn->prepare("SELECT COUNT(*) as solved FROM team_progress WHERE team_id = ?");
    $stmt->bind_param("i", $teamId);
    $stmt->execute();
    $solvedCount = intval($stmt->get_result()->fetch_assoc()['solved']);

    // --- Achievements (only track newly earned this request) ---
    $newAchievements = [];
    $userSolves = intval($conn->query("SELECT COUNT(*) as c FROM team_progress WHERE solved_by_user_id = $userId")->fetch_assoc()['c']);

    $awardAchievement = function($key, $xp) use ($conn, $userId, &$newAchievements) {
        $conn->query("INSERT IGNORE INTO user_achievements (user_id, achievement_key) VALUES ($userId, '$key')");
        if ($conn->affected_rows > 0) {
            $conn->query("UPDATE users SET xp = xp + $xp WHERE id = $userId");
            $newAchievements[] = $key;
        }
    };

    if ($userSolves === 1) $awardAchievement('prva_krafna', 50);
    if ($userSolves >= 3)  $awardAchievement('secer_i_sol', 75);

    // brzi_prsti: solved within 10 minutes of competition start
    $compStart = $competition['start_time'] ?? null;
    if ($compStart && (time() - strtotime($compStart)) <= 600) {
        $awardAchievement('brzi_prsti', 200);
    }

    // Check if team has solved all 6 tasks now
    if ($solvedCount >= 6) {
        // slatka_pobjeda: all team members
        $members = $conn->query("SELECT user_id FROM team_members WHERE team_id = $teamId")->fetch_all(MYSQLI_ASSOC);
        foreach ($members as $m) {
            $mid = intval($m['user_id']);
            $conn->query("INSERT IGNORE INTO user_achievements (user_id, achievement_key) VALUES ($mid, 'slatka_pobjeda')");
            if ($conn->affected_rows > 0) {
                $conn->query("UPDATE users SET xp = xp + 150 WHERE id = $mid");
                if ($mid === intval($userId)) $newAchievements[] = 'slatka_pobjeda';
            }
        }
        // solo_kuhar: only if solo
        $teamSize = intval($conn->query("SELECT COUNT(*) as c FROM team_members WHERE team_id = $teamId")->fetch_assoc()['c']);
        if ($teamSize === 1) $awardAchievement('solo_kuhar', 300);
    }

    echo json_encode([
        'success'          => true,
        'message'          => "Task riješen! +{$points} bodova za tim!",
        'points_awarded'   => $points,
        'team_score'       => $teamScore,
        'tasks_solved'     => $solvedCount,
        'total_tasks'      => 6,
        'new_achievements' => $newAchievements,
    ]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

$conn->close();
?>
