<?php 
  include('allAccessHeaders.php');
  include('databaseConnect.php');

  //Get the staff data for the landing page/tutors section

  try {
    //Get the top tutors data
    $tutorsQuery = $db->prepare("SELECT * FROM staffTestingTable ORDER BY tutorRating DESC LIMIT 3");
    $tutorsQuery->execute();
    $tutorsData = $tutorsQuery->fetchAll(PDO::FETCH_ASSOC);

    $tutorsQuery->closeCursor();

    //Get the top reviews data
    $reviewsQuery = $db->prepare("SELECT * FROM reviewsTestingTable ORDER BY reviewScore DESC LIMIT 10");
    $reviewsQuery->execute();
    $reviewsData = $reviewsQuery->fetchAll(PDO::FETCH_ASSOC);

    $reviewsQuery->closeCursor();

    //Combine the data
    $finalArray = [$tutorsData, $reviewsData];
    
    echo json_encode($finalArray);
  }

  catch(Exception $e) { 
    die('Error: ' . $e->getMessage());  
    echo json_encode("Error! Cannot connect to server!");
  }
?>