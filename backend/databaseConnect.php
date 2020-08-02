<?php 
  // Call the database
  try {
    $db = new PDO('mysql:host=localhost;dbname=u601947865_kiipgrammar;charset=utf8', 'u601947865_josmdaw', '>VJ7vFl0Z', array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
    
  } catch(Exception $e) { 
    die('Error: ' . $e->getMessage()); 
  }

?>