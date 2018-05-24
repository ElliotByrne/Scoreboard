<?php

// Create database connection - Top line is for database conenction on webserver, second line is for local development.

//$con = new mysqli('localhost', 'theciwcr', 'QkFY5Do3P71H68l', 'theciwcr_s4s');
$con = new mysqli('localhost', 'root', 'root', 's4s');

// Check if connection is successful - if not produce error message.
if ($con->connect_error) {
    die("Connection failed: " . $con->connect_error);
}

?>