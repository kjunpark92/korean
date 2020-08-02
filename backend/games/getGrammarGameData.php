<?php 
    include('allAccessHeaders.php');
    include('databaseConnect.php');

    //get the grammar data for the grammar games
    //**TO DO: **//
    //Combined grammar game data/vocab game data files

    try {
        $level = (int)$_POST['level'];
        $limit1 = (int)$_POST['unit'];
        $query = $db->prepare("SELECT * FROM grammarTestingTable WHERE level= :level LIMIT :limit1, 12");
        $query->bindParam("limit1", $limit1, PDO::PARAM_INT);
        $query->bindParam("level", $level, PDO::PARAM_INT);
        $query->execute();
        $data = $query->fetchAll(PDO::FETCH_OBJ);
        echo json_encode($data);
    
    }

    catch(Exception $e) { 
        die('Error: ' . $e->getMessage());  
        echo json_encode("Error! Cannot connect to server!");
    }



?>