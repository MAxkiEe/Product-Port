<?php
try {
    $conn = new PDO("sqlsrv:Server=localhost,1433;Database=master;Encrypt=yes;TrustServerCertificate=1", "sa", "P@ssword123");
    $conn->exec("CREATE DATABASE Phetkasem");
    echo "Database Phetkasem created successfully\n";
} catch (PDOException $e) {
    echo "Failed: " . $e->getMessage() . "\n";
}
