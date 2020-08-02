<?php 
    include('allAccessHeaders.php');
    include('databaseConnect.php');

    //get data for friends/other users
    try {
        $query = $db->prepare("SELECT username, rank, date_created FROM userTestingTable WHERE username = :username");
        $query->execute(array('username'=> $_POST['username']));
        $results = $query->fetch(PDO::FETCH_OBJ);
    
        echo json_encode($results);
    
        $query->closeCursor();
    }
    
    catch(Exception $e) { 
        die('Error: ' . $e->getMessage());  
        echo json_encode("Error! Cannot connect to server!");
    }

?>