<?php 
    include('allAccessHeaders.php');
    include('databaseConnect.php');

    try {
        
        //to retrieve the friends for each user
        $friendsQuery = $db->prepare("SELECT friendsTestingTable.friends_username
        FROM friendsTestingTable
        JOIN userTestingTable
        ON friendsTestingTable.username = userTestingTable.username 
        AND userTestingTable.username = :thisUsername"
        );
        $friendsQuery->execute(array('thisUsername'=> $_POST['username']));
        $friendsResults = $friendsQuery->fetchAll(PDO::FETCH_ASSOC);

        $friendsQuery->closeCursor();

        //to retrieve the awards for each user
        $awardsQuery = $db->prepare("SELECT * FROM awardsTestingTable WHERE username = :username");
        $awardsQuery->execute(array('username'=> $_POST['username']));
        $awardsResults = $awardsQuery->fetchAll(PDO::FETCH_ASSOC);

        $awardsQuery->closeCursor();


        //to get the scoreboard for each user
        $scoreboardQuery = $db->prepare("SELECT * FROM scoreboardTestingTable WHERE username = :username ORDER BY score DESC");
        $scoreboardQuery->execute(array('username'=> $_POST['username']));
        $scoreboardResults = $scoreboardQuery->fetchAll(PDO::FETCH_ASSOC);
    
        $scoreboardQuery->closeCursor();

        $finalArray = [$friendsResults, $awardsResults, $scoreboardResults];
    
        echo json_encode($finalArray);

    }
    catch(Exception $e) { 
        die('Error: ' . $e->getMessage());  
        echo json_encode("Error! Cannot connect to server!");
    }

?>