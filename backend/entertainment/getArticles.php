<?php

    include('allAccessHeaders.php');
    include('databaseConnect.php');

    $limit1 = (!empty($_POST['limit'])) ? (int)$_POST['limit'] : 0;
    $keywords = (!empty($_POST['keywords'])) ? '%'.$_POST['keywords'].'%' : "%%";

    ///// Count of articles /////
    $queryCount = "SELECT COUNT(*) AS numberOfArticles FROM articlesTestingTable  WHERE keywords LIKE :keywords";
    $stmt = $db->prepare($queryCount);
    $stmt->bindParam("keywords", $keywords, PDO::PARAM_STR);
    $stmt->execute();
    $data = $stmt->fetch(PDO::FETCH_OBJ);
    
    ///// Articles /////
    $queryStr ="SELECT articlesTestingTable.id, articlesTestingTable.title, articlesTestingTable.content, LOWER(DATE_FORMAT(articlesTestingTable.date, '%d/%m/%Y %l:%i%p')) AS date, COUNT(commentsTestingTable.id) AS numberOfComments
            FROM articlesTestingTable
            LEFT JOIN commentsTestingTable
            ON articlesTestingTable.id = commentsTestingTable.id_articles
            WHERE keywords LIKE :keywords
            GROUP BY articlesTestingTable.id
            ORDER BY date DESC
            LIMIT $limit1, 5";
    $queryArticles = $db->prepare($queryStr);
    $queryArticles->bindParam("keywords", $keywords, PDO::PARAM_STR);
    $queryArticles->execute();

    // Creation JSON Object
    $data->listOfArticles = $queryArticles->fetchAll(PDO::FETCH_OBJ);
    echo json_encode($data);

    $stmt->closeCursor();
    $queryArticles->closeCursor();
?>
