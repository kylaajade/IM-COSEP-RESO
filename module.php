<!DOCTYPE html>
<html>
<head>
    <title>Module - Basic EA System</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>

<?php
$modules = [
    "data_management" => "Data Management",
    "app_management" => "Application Management",
    "tech_management" => "Technology Management",
    "process_management" => "Business Process Management",
    "org_structure" => "Organizational Structure",
    "compliance_management" => "Compliance & Risk",
    "reporting" => "Dashboard & Reporting"
];

$module = isset($_GET['module']) ? $_GET['module'] : '';

if (array_key_exists($module, $modules)) {
    echo "<h2>{$modules[$module]}</h2>";

    // Dynamic Form Based on Module
    echo "
    <form action='module.php?module=$module' method='post'>
        <label>Enter Information for {$modules[$module]}:</label><br>
        <input type='text' name='data' placeholder='Enter data'><br>
        <button type='submit'>Save</button>
    </form>";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $data = htmlspecialchars($_POST["data"]);
        echo "<p>Data Saved in {$modules[$module]}: $data</p>";
    }
} else {
    echo "<p>Module not found.</p>";
}

?>

<a href="index.php">Back to Dashboard</a>

</body>
</html>
