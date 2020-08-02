<?php 
    include('allAccessHeaders.php');
    include('databaseConnect.php');

    //get everything from the scoreboard for each game

    try {
        $level = $_POST['level'];
        $gameName = $_POST['gameName'];
    
        $query = $db->prepare("SELECT * FROM scoreboardTestingTable WHERE game_name= :gameName AND level = :level ORDER BY score DESC LIMIT 0,10");
        $query->execute(array(
            'gameName' => $gameName,
            'level' => $level
        ));
        $data = $query->fetchAll(PDO::FETCH_OBJ);
        echo json_encode($data);

    }

    catch(Exception $e) { 
        die('Error: ' . $e->getMessage());  
        echo json_encode("Error! Cannot connect to server!");
    }



?>