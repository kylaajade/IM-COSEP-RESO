<?php
require 'db_conn.php';

header('Content-Type: application/json');

try {
    // Exclude user_id 40
    $stmt = $conn->prepare("SELECT user_id, first_name, last_name, course, address, is_verified FROM user_table WHERE user_id <> 40");
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
