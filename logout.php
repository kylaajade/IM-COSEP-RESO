<?php
session_start();
session_unset();
session_destroy();

header('Content-Type: application/json');
echo json_encode(['res' => 'success', 'msg' => 'Logged out successfully']);
?>