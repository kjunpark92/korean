<?php 
    include('allAccessHeaders.php');
    include('databaseConnect.php');

    //get the Articles for the Entertainment page

    $query = $db->prepare("SELECT * FROM commentsTestingTable WHERE id_articles = 1");
    $query->execute();
    $results = $query->fetchAll(PDO::FETCH_ASSOC);
    $json = json_encode($results);

    echo $json;

    $query->closeCursor();
?>