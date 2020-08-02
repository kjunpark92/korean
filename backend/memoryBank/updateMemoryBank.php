<?php 
  include('allAccessHeaders.php');
  include('databaseConnect.php');

    
  try {

    //1) Check the action type first
    $actionType = $_POST['actionType'];
    $itemType = $_POST['itemType'];

    if($actionType === 'addItem'){

      //2)Check the item type
      if($itemType === 'Grammar'){

        //3) Check if existing
        $addGrammarQuery = $db->prepare("SELECT count(*) AS existing_item FROM grammarBankTestingTable WHERE username=:username AND grammar_id = :grammar_id");
        $addGrammarQuery->execute(array(
          'username' => $_POST['username'], 
          'grammar_id'=> $_POST['id']
        ));
        $addGrammarData = $addGrammarQuery->fetch(PDO::FETCH_OBJ);
        
        //4) Insert data
        if($addGrammarData->existing_item === "0"){
          $addGrammarInsert = $db->prepare("INSERT INTO grammarBankTestingTable(username, grammar_id) VALUES (:username,:grammar_id)");
          $addGrammarInsert ->execute(array(
            'username' => $_POST['username'], 
            'grammar_id'=> $_POST['id']
          ));
          echo json_encode('Grammar inserted into MemoryBank!');
        } else {
          echo json_encode('Already in MemoryBank!');
        }
        
      } else if ($itemType === 'Vocab'){
        //5) Check if existing
        $addVocabQuery = $db->prepare("SELECT count(*) AS existing_item FROM vocabBankTestingTable WHERE username=:username AND word_id = :word_id");
        $addVocabQuery->execute(array(
          'username' => $_POST['username'], 
          'word_id'=> $_POST['id']
        ));
        $addVocabData = $addVocabQuery->fetch(PDO::FETCH_OBJ);
        
        //6) Insert data
        if($addVocabData->existing_item === "0"){
          $addVocabInsert = $db->prepare("INSERT INTO vocabBankTestingTable(username, word_id) VALUES (:username,:word_id)");
          $addVocabInsert ->execute(array(
            'username' => $_POST['username'], 
            'word_id'=> $_POST['id']
          ));
          echo json_encode('Vocab inserted into MemoryBank!');
        } else {
          echo json_encode('Already in MemoryBank!');
        }
      } 
     
      //7) Delete data
    } else if($actionType === 'deleteItem'){
      //8) Delete Grammar
      if($itemType === 'Grammar'){
        $deleteGrammar = $db->prepare("DELETE FROM grammarBankTestingTable WHERE username=:username AND grammar_id = :grammar_id");
        $deleteGrammar->execute(array(
          'username' => $_POST['username'], 
          'grammar_id'=> $_POST['id']
        ));
        echo json_encode('Grammar deleted!');

        //9) Delete Vocab
      } else if ($itemType === 'Vocab') {
        $deleteVocab = $db->prepare("DELETE FROM vocabBankTestingTable WHERE username=:username AND word_id = :word_id");
        $deleteVocab ->execute(array(
          'username' => $_POST['username'], 
          'word_id'=> $_POST['id']
        ));
        echo json_encode('Vocab deleted!');
      }


    } else {
      echo json_encode('Action type missing.');
    }

  }
  catch(Exception $e) { 
      die('Error: ' . $e->getMessage());  
      echo json_encode("Error! Cannot connect to server!");
  }

?>