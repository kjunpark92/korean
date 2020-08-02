<?php 
    include('allAccessHeaders.php');
    include('databaseConnect.php');

    //Check the login info and retrieve userdata

    //prevent naughtiness from users
    $email = addslashes(htmlspecialchars(htmlentities(trim($_POST['email']))));
    $loginPassword = $_POST['password'];
    $loginType = $_POST['loginType'];

    try {

        //For the regular login
        if($loginType === 'Regular Login'){
            //1) Check the email exists
            $emailQuery = $db->prepare("SELECT count(*) AS existing_email FROM userTestingTable WHERE email=:email");
            $emailQuery->execute(array('email' => $email));
            $emailResults = $emailQuery->fetch(PDO::FETCH_OBJ);
            $emailQuery->closeCursor();

            if ($emailResults->existing_email === 0) {
                //if email does not exist, tell user
                echo json_encode("Email does not exist!");

            } else {
                //2) Check the password is correct & retrieve user data
                $userDataQuery = $db->prepare("SELECT * FROM userTestingTable WHERE email=:email");
                $userDataQuery->execute(array('email' => $email));
                $userDataResults = $userDataQuery->fetch(PDO::FETCH_OBJ);

                if (password_verify($loginPassword, $userDataResults->password)) { 
                    echo json_encode($userDataResults); //return user data
                } else {
                    echo json_encode("Incorrect Password!"); 
                }
                $userDataQuery->closeCursor();
            }

        } else if($loginType === 'Cookies Login'){

            //3) Check the cookies data is correct & retrieve user data
            $userDataQuery = $db->prepare("SELECT * FROM userTestingTable WHERE email=:email");
            $userDataQuery->execute(array('email' => $email));
            $userDataResults = $userDataQuery->fetch(PDO::FETCH_OBJ);

            if ($loginPassword === $userDataResults->password) { 
                echo json_encode($userDataResults); //return user data
            } else {
                echo json_encode("Cookie Error!"); 
            }
            $userDataQuery->closeCursor();
            
        } else {
            echo json_encode('Could not complete user request');
        }
    }

    catch(Exception $e) { 
        die('Error: ' . $e->getMessage());  
        echo json_encode("Error! Cannot connect to server!");
    }

?>