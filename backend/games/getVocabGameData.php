<?php 
    include('allAccessHeaders.php');
    include('databaseConnect.php');

    //get the vocab data for the vocab games

    try {
        $query = $db->prepare("SELECT * FROM vocabTestingTable WHERE level= :level AND group_number= :group_number");
        $query->execute(array(
        "level" => $_POST['level'], 
        "group_number" => $_POST['unit']
        ));
        $data = $query->fetchAll(PDO::FETCH_OBJ);
        echo json_encode($data);
    }

    catch(Exception $e) { 
        die('Error: ' . $e->getMessage());  
        echo json_encode("Error! Cannot connect to server!");
    }


?>