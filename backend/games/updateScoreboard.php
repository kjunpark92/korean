<?php 
    include('allAccessHeaders.php');
    include('databaseConnect.php');

    //Update a new entry onto the scoreboard

    $username = $_POST['username'];
    $level = $_POST['level'];
    $gameName = $_POST['gameName'];
    

    try {




        //1) Check for existing score in DB
        $query = $db->prepare("SELECT count(*) AS existing_score FROM scoreboardTestingTable WHERE username=:username AND level=:level AND game_name =:game_name");
        $query->execute(
            array(
            "username"=> $username,
            "level" => $level,
            "game_name" => $gameName,
            ));

        $results = $query->fetch();

        $query->closeCursor();

        if ($results['existing_score'] == 1) {

            // echo json_encode('testing query');

            //2) Get the current score
            $scoreQuery = $db->prepare("SELECT score as current_score FROM scoreboardTestingTable WHERE username=:username AND level=:level AND game_name =:game_name");
            $scoreQuery->execute(
                array(
                    "username"=> $username,
                    "level" => $level,
                    "game_name" => $gameName,
                ));
        
            $scoreResults = $scoreQuery->fetch();

            $scoreQuery->closeCursor();

            //3) Update the existing score
            $newScore = $scoreResults['current_score'] + $_POST['score'];

            $updateScoreboardQuery = $db->prepare("UPDATE scoreboardTestingTable SET score=:score WHERE username=:username AND level=:level AND game_name =:game_name");
            $updateScoreboardQuery->execute(            
                array(
                    "username"=> $username,
                    "level" => $level,
                    "game_name" => $gameName,
                    "score" => $newScore 
                ));
        } 
        else {

            //4) If score & user do not exist in DB, insert into
            $response = $db->prepare("INSERT INTO scoreboardTestingTable(username, level, game_name,score) VALUES (:username, :level, :game_name, :score)");
            $response ->execute(
                array(
                    "username"=> $username,
                    "level" => $level,
                    "game_name" => $gameName,
                    "score" => $_POST['score']
                )
            );
            echo json_encode("New Score added");

        }

        //5) Update the user rank with game score
        $updateRankQuery  = $db->prepare("UPDATE userTestingTable SET `rank`=:score WHERE username=:username");
        $updateRankQuery ->execute(array("score" => $_POST['updatedRank'], "username" => $_POST['username']));
        echo json_encode('Updated Rank!');
    }

    catch(Exception $e) { 
        die('Error: ' . $e->getMessage());  
        echo json_encode("Data NOT sent, please check the code!");
    }


?>