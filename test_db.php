<?php
try {
    $conn = new PDO("sqlsrv:Server=localhost,1433;Database=master;Encrypt=yes;TrustServerCertificate=1", "sa", "P@ssword123");
    echo "Connected successfully to master\n";
} catch (PDOException $e) {
    echo "Connection failed to master: " . $e->getMessage() . "\n";
}

try {
    $conn2 = new PDO("sqlsrv:Server=localhost,1433;Database=Phetkasem;Encrypt=yes;TrustServerCertificate=1", "sa", "P@ssword123");
    echo "Connected successfully to Phetkasem\n";
} catch (PDOException $e) {
    echo "Connection failed to Phetkasem: " . $e->getMessage() . "\n";
}
