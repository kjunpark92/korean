<?php 
    include('allAccessHeaders.php');
    include('databaseConnect.php');

    //get all the courses data
    try {
        $query = $db->prepare("SELECT * FROM coursesTestingTable");
        $query->execute();
        $results = $query->fetchAll(PDO::FETCH_ASSOC);
        $query->closeCursor();

        echo json_encode($results);
        
    }

    catch(Exception $e) { 
        die('Error: ' . $e->getMessage());  
        echo json_encode("Data NOT sent, please check the code!");
    }
?>