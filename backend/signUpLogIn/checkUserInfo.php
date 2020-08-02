<?php 
    include('allAccessHeaders.php');
    include('databaseConnect.php');

    

    $username = addslashes(htmlspecialchars(htmlentities(trim($_POST['username']))));
    $email = addslashes(htmlspecialchars(htmlentities(trim($_POST['email']))));
    $userRequest = $_POST['userRequest'];

    try {

        if($userRequest === 'emailCheck'){

            //Check if the email exists
            $emailQuery = $db->prepare("SELECT count(*) AS existing_email FROM userTestingTable WHERE email=:email");
            $emailQuery->execute(array('email' => $email));
            $emailResults = $emailQuery->fetch(PDO::FETCH_OBJ);
            if ($emailResults->existing_email >= 1) {
                //if email already exists, inform the user
                echo json_encode("This email has already been registered on this site.");
            } else {
              echo json_encode("Email does not exist.");
            }

            $emailQuery->closeCursor();

            

        } 
        else if ($userRequest === 'usernameCheck'){

            //check the username exists on signup
            $usernameQuery = $db->prepare("SELECT count(*) AS existing_username FROM userTestingTable WHERE username=:username");
            $usernameQuery->execute(array('username' => $username));
            $usernameResults = $usernameQuery->fetch(PDO::FETCH_OBJ);
            if ($usernameResults->existing_username >= 1) {
                //if username exists, warn the user
                echo json_encode("This username has already been registered on this site.");
            } else {
                echo json_encode("Username does not exist.");
            }

            $usernameQuery->closeCursor();
        } 
        
        else {
            echo json_encode('Unable to complete user request.');
        }


    }

    catch(Exception $e) { 
        die('Error: ' . $e->getMessage());  
        echo json_encode("Error! Cannot connect to server!");
    }

?>