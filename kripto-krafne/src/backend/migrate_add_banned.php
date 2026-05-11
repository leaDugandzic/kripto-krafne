<?php
// One-time migration: adds is_banned column to users table.
// Visit http://localhost/kripto-krafne/kripto-krafne/src/backend/migrate_add_banned.php
// then DELETE this file.
header("Content-Type: text/plain; charset=UTF-8");

require_once "./dbConnection.php";

$result = $conn->query("SHOW COLUMNS FROM users LIKE 'is_banned'");
if ($result && $result->num_rows > 0) {
    echo "Column 'is_banned' already exists — nothing to do.\n";
} else {
    if ($conn->query("ALTER TABLE users ADD COLUMN is_banned TINYINT(1) NOT NULL DEFAULT 0")) {
        echo "SUCCESS: Column 'is_banned' added to users table.\n";
        echo "You can now delete this file.\n";
    } else {
        echo "ERROR: " . $conn->error . "\n";
    }
}
$conn->close();
?>
