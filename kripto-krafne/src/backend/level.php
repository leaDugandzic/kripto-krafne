<?php

require "dbConnection.php";

$level_id= isset($_GET["id"]) ? intval($_GET["id"]) : 0;

if($level_id === 0){
    echo json_encode(["success"=> false, "message"=>"Potreban level id"]);
    exit;
}

$gameData = [];
$vulnerabilities = [];

$query= "SELECT game_type FROM game_levels WHERE id=?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $leveId);
$stmt->execute();
$result= $stmt->get_result();
$level_info = $result->fetch_assoc();

echo $level_info;
if(!$level_info){
    echo json_encode(["success"=> false, "message"=>"Level nije pronaden"]);
    exit;
}
switch ($level_info['game_type']) {
    case 'dragDrop':
        $query = "SELECT id, term, description FROM drag_drop_games WHERE level_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $level_id);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $game_data[] = $row;
        }
        break;
        
    case 'memoryCards':
        $query = "SELECT id, term, description FROM memory_card_games WHERE level_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $level_id);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $game_data[] = $row;
        }
        break;
        
    case 'findVulnerability':
        $query = "SELECT id, code, total_vulnerabilities FROM vulnerability_games WHERE level_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $level_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $vuln_game = $result->fetch_assoc();
        
        if ($vuln_game) {
            $query = "SELECT type_name FROM vulnerability_types WHERE vulnerability_game_id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("i", $vuln_game['id']);
            $stmt->execute();
            $result = $stmt->get_result();
            $types = array();
            while ($row = $result->fetch_assoc()) {
                $types[] = $row['type_name'];
            }
            
            $query = "SELECT line_number, type, description FROM vulnerability_solutions WHERE vulnerability_game_id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("i", $vuln_game['id']);
            $stmt->execute();
            $result = $stmt->get_result();
            $solutions = array();
            while ($row = $result->fetch_assoc()) {
                $solutions[] = $row;
            }
            
            $vulnerabilities = array(
                'code' => $vuln_game['code'],
                'total' => $vuln_game['total_vulnerabilities'],
                'types' => $types,
                'solutions' => $solutions
            );
        }
        break;
}

$response = array(
    "success" => true,
    "data" => array(
        'game' => $game_data,
        'vulnerabilities' => $vulnerabilities
    )
);

echo json_encode($response);
$conn->close();
