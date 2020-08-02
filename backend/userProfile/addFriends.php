<?php 
  include('allAccessHeaders.php');
  include('databaseConnect.php');

  //Add friend to user profile
  try {

    //1) Check if friend already exists
    $friendQuery = $db->prepare("SELECT count(*) AS existing_friend FROM friendsTestingTable WHERE username=:username AND friends_username=:friends_username");
    $friendQuery->execute(array(
      'username' => $_POST['username'], 
      "friends_username"=> $_POST['friends_username']
    ));
    $friendData = $friendQuery->fetch(PDO::FETCH_OBJ);

    //2) If 0, INSERT FRIEND
    if ($friendData->existing_friend === "0") {
      $response = $db->prepare("INSERT INTO friendsTestingTable(username, friends_username) VALUES (:username,:friends_username)");
      $response ->execute(
        array(
          "username"=> $_POST['username'],
          "friends_username"=> $_POST['friends_username']
        )
      );
      
      echo json_encode("You are now friends!");

    } else {
      //3) If friend already exists, inform the user
      echo json_encode("You are already friends!");
    }

  }
  catch(Exception $e) { 
    die('Error: ' . $e->getMessage());  
    echo json_encode("Error! Cannot connect to server!");
  }

?>