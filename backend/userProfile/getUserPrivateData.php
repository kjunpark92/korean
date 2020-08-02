<?php 
    include('allAccessHeaders.php');
    include('databaseConnect.php');

    

    try {
        //to retrieve the credit history for each user
        $creditsQuery = $db->prepare("SELECT * FROM creditsTestingTable WHERE username = :username");
        $creditsQuery->execute(array('username'=> $_POST['username']));
        $creditResults = $creditsQuery->fetchAll(PDO::FETCH_ASSOC);
    
        $creditsQuery->closeCursor();

        //to retrieve the corrections for each user
        $correctionsQuery = $db->prepare("SELECT original_text, date_corrected, corrected_text FROM correctionsTestingTable WHERE username = :username");
        $correctionsQuery->execute(array('username' => $_POST['username']));
        $correctionsResults = $correctionsQuery->fetchAll(PDO::FETCH_ASSOC);

        $correctionsQuery->closeCursor();

        //TO DO: User courses
        // $coursesQuery = $db->prepare("SELECT * FROM userCourses WHERE username = :username");
        // $coursesQuery->execute(array('username' => $_POST['username']));
        // $coursesResults = $coursesQuery->fetchAll(PDO::FETCH_ASSOC);

        // $coursesQuery->closeCursor();


        $finalArray = [$creditResults, $correctionsResults];
    
        echo json_encode($finalArray);
        
    }

    catch(Exception $e) { 
        die('Error: ' . $e->getMessage());  
        echo json_encode("Data NOT sent, please check the code!");
    }


?>