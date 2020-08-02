<?php 
    include('allAccessHeaders.php');
    include('databaseConnect.php');
    
    try {

        //To search the database for grammar
        $request = addslashes(htmlspecialchars(htmlentities(trim($_POST['query']))));
        $grammarQuery = $db->prepare("SELECT * FROM grammarTestingTable WHERE english_explanation LIKE '%$request%' OR grammar_point LIKE '%$request%' LIMIT 0, 6");
        $grammarQuery->execute();
        $grammarResults = $grammarQuery->fetchAll(PDO::FETCH_ASSOC);

        $grammarQuery->closeCursor();

        //To search the database for vocab
        $vocabQuery = $db->prepare("SELECT * FROM vocabTestingTable WHERE english REGEXP '[[:<:]]" . $request . "[[:>:]]' OR korean LIKE '%$request%' LIMIT 0, 3");
        $vocabQuery->execute();
        $vocabResults = $vocabQuery->fetchAll(PDO::FETCH_ASSOC);

        $vocabQuery->closeCursor();

        $finalArray = [$grammarResults, $vocabResults];
    
        echo json_encode($finalArray);

    }
    catch(Exception $e) { 
        die('Error: ' . $e->getMessage());  
        echo json_encode("Error! Cannot connect to server!");
    }

?>