<?php 
    include('allAccessHeaders.php');
    include('databaseConnect.php');

    //This page will insert user details from the sign up form

    //To prevent naughtiness from users
    $username = addslashes(htmlspecialchars(htmlentities(trim($_POST['username']))));
    $email = addslashes(htmlspecialchars(htmlentities(trim($_POST['email']))));
    $studyReason = $_POST['studyReason'];
    $password = $_POST['password'];
    $confirmPassword = $_POST['confirmPassword'];
    $subscribeCheck = $_POST['subscribeCheck'];

    //To hash the password
    $passwordHashed = password_hash($password, PASSWORD_DEFAULT);

    try {

        $response = $db->prepare("INSERT INTO userTestingTable(email, username, password, studyReason, subscribeCheck) VALUES (:email, :username, :password, :studyReason, :subscribeCheck)");
        $response ->execute(
            array(
                "email"=> $email,
                "username"=> $username,
                "password" => $passwordHashed,
                "studyReason" => $studyReason,
                "subscribeCheck" => $subscribeCheck
            )
        );
        echo json_encode("Data sent");
    }

    catch(Exception $e) { 
        die('Error: ' . $e->getMessage());  
        echo json_encode("Data NOT sent, please check the code!");
    }


?>