<?php

// Database configuration - update these values according to your .env file
$host = '127.0.0.1';
$database = 'covoiturage_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check if phone column already exists
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'phone'");
    if ($stmt->rowCount() == 0) {
        // Add phone column
        $sql = "ALTER TABLE users ADD COLUMN phone VARCHAR(255) NULL AFTER email";
        $pdo->exec($sql);
        echo "Phone column added successfully!\n";
    } else {
        echo "Phone column already exists!\n";
    }

} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
