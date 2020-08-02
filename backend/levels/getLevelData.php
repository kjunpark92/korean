<?php 
    include('allAccessHeaders.php');
    include('databaseConnect.php');

    //get the grammar data

    try {
        $level = $_POST['level'];
        $dataRequest = $_POST['dataRequest'];

        //1) Get Grammar
        if($dataRequest === 'Grammar'){

            $grammarQuery = $db->prepare("SELECT * FROM grammarTestingTable WHERE level= :level");
            $grammarQuery->execute(array('level' => $level));
            $grammarResults = $grammarQuery->fetchAll(PDO::FETCH_OBJ);
            echo json_encode($grammarResults);

            //2) Get vocab
        } else if($dataRequest === 'Vocab'){

            $vocabQuery = $db->prepare("SELECT * FROM vocabTestingTable WHERE level= :level");
            $vocabQuery->execute(array('level' => $level));
            $vocabResults = $vocabQuery->fetchAll(PDO::FETCH_OBJ);
            echo json_encode($vocabResults);

        }
    
    }

    catch(Exception $e) { 
        die('Error: ' . $e->getMessage());  
        echo json_encode("Error! Cannot connect to server!");
    }

?>