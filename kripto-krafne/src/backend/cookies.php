<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

setcookie('isAdmin', '0', time() + 86400, '/', 'localhost', false, true); 

$isAdmin = isset($_COOKIE['isAdmin']) && $_COOKIE['isAdmin'] == '1';

echo json_encode(['isAdmin' => $isAdmin]);
?>