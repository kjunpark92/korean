<?php 
    include('allAccessHeaders.php');
    include('databaseConnect.php');

    //This page is to make changes to the user account details:
    //email - password - delete account

    //security just in case
    $username = $_POST['username'];
    $currentEmail = addslashes(htmlspecialchars(htmlentities(trim($_POST['currentEmail']))));
    $newEmail = addslashes(htmlspecialchars(htmlentities(trim($_POST['newEmail']))));
    $currentPassword = $_POST['password'];
    $newPassword = password_hash($_POST['newPassword'], PASSWORD_DEFAULT);

    $userRequest = $_POST['userRequest'];

    try {

        //1)Check username & password
        $confirmUserQuery = $db->prepare("SELECT * FROM userTestingTable WHERE username = :username");
        $confirmUserQuery->execute(array('username' => $username));
        while ($passwordData = $confirmUserQuery->fetch(PDO::FETCH_OBJ)){

          //2)Confirm the user current hashed password matches the stored hashed password
          if($currentPassword === $passwordData->password){

            //3) Check request 
            if($userRequest === "newEmail"){
              //Update the email
              $updateEmailQuery = $db->prepare("UPDATE userTestingTable SET email= :newEmail WHERE username= :username");
              $updateEmailQuery->execute(array("newEmail" => $newEmail, "username" => $username));
              
              echo json_encode("Email Changed");
              $updateEmailQuery->closeCursor();

            } else if ($userRequest === "newPassword"){
              //Update the password
              $updatePasswordQuery = $db->prepare("UPDATE userTestingTable SET password= :newPassword WHERE username= :username");
              $updatePasswordQuery->execute(array("newPassword" => $newPassword, "username" => $username));

              echo json_encode("Password Changed");
              $updatePasswordQuery->closeCursor();

            } else if ($userRequest === "deleteAccount"){
              //Delete the account
              $deleteAccountQuery = $db->prepare("DELETE FROM userTestingTable WHERE username = :username");
              $deleteAccountQuery->execute(array("username" => $username));

              echo json_encode("Account Deleted");
              $deleteAccountQuery->closeCursor();
            } else {
              echo json_encode("Could not perform user request");
            }

            
          } else {
            echo json_encode("User password incorrect");
          }
        } 

        $confirmUserQuery->closeCursor();
        
    }

    catch(Exception $e) { 
        die('Error: ' . $e->getMessage());  
        echo json_encode("Error!");
    }


?>