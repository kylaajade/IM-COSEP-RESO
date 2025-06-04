<?php
require 'db_conn.php'; // Your existing PDO connection

// Total tasks
$stmt = $conn->query("SELECT COUNT(*) AS total FROM tasks");
$totalTasks = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Task completion status
$completionStats = $conn->query("SELECT task_status, COUNT(*) AS count FROM task_assignments GROUP BY task_status");

// Submission status
$submissionStats = $conn->query("SELECT submission_status, COUNT(*) AS count FROM task_assignments GROUP BY submission_status");

// Submission types
$submissionTypes = $conn->query("SELECT submission_type, COUNT(*) AS count FROM task_assignments GROUP BY submission_type");

// Tasks per student
$tasksPerStudent = $conn->query("SELECT student_id, COUNT(*) AS task_count FROM task_assignments GROUP BY student_id");

// Output results as HTML
echo "<h2>Total Tasks: {$totalTasks}</h2>";

echo "<h2>Task Completion Status</h2><table><tr><th>Status</th><th>Count</th></tr>";
while ($row = $completionStats->fetch(PDO::FETCH_ASSOC)) {
    echo "<tr><td>{$row['task_status']}</td><td>{$row['count']}</td></tr>";
}
echo "</table>";

echo "<h2>Submission Status Breakdown</h2><table><tr><th>Status</th><th>Count</th></tr>";
while ($row = $submissionStats->fetch(PDO::FETCH_ASSOC)) {
    echo "<tr><td>{$row['submission_status']}</td><td>{$row['count']}</td></tr>";
}
echo "</table>";

echo "<h2>Submission Types</h2><table><tr><th>Type</th><th>Count</th></tr>";
while ($row = $submissionTypes->fetch(PDO::FETCH_ASSOC)) {
    echo "<tr><td>{$row['submission_type']}</td><td>{$row['count']}</td></tr>";
}
echo "</table>";

echo "<h2>Tasks Assigned Per Student</h2><table><tr><th>Student ID</th><th>Task Count</th></tr>";
while ($row = $tasksPerStudent->fetch(PDO::FETCH_ASSOC)) {
    echo "<tr><td>{$row['student_id']}</td><td>{$row['task_count']}</td></tr>";
}
echo "</table>";
?>
