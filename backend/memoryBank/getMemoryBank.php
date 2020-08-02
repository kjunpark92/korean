<?php 
    include('allAccessHeaders.php');
    include('databaseConnect.php');
    
    try {

        //To get the memory bank data for each user
        $username = $_POST['username'];

        //1) Get Vocabulary
        $vocabDataQuery = $db->prepare("SELECT *
          FROM vocabTestingTable
          JOIN vocabBankTestingTable
          ON vocabBankTestingTable.word_id = vocabTestingTable.id 
          AND vocabBankTestingTable.username = :thisUsername"
        );
        $vocabDataQuery->execute(array('thisUsername'=> $username));
        $vocabDataResults = $vocabDataQuery->fetchAll(PDO::FETCH_ASSOC);
        $vocabDataQuery->closeCursor();

        //2) Get Grammar 
        $grammarDataQuery = $db->prepare("SELECT *
          FROM grammarTestingTable
          JOIN grammarBankTestingTable
          ON grammarBankTestingTable.grammar_id = grammarTestingTable.id 
          AND grammarBankTestingTable.username = :thisUsername"
        );
        $grammarDataQuery->execute(array('thisUsername'=> $username));
        $grammardataResults = $grammarDataQuery->fetchAll(PDO::FETCH_ASSOC);
        $grammarDataQuery->closeCursor();

        $finalArray = [$vocabDataResults, $grammardataResults];

        echo json_encode($finalArray);

    }
    catch(Exception $e) { 
        die('Error: ' . $e->getMessage());  
        echo json_encode("Error! Cannot connect to server!");
    }

?>