<?php
    include('allAccessHeaders.php');
    include('databaseConnect.php');

    $keywords = (!empty($_POST['keywords'])) ? '%'.$_POST['keywords'].'%' : "%%";
    $query = "SELECT COUNT(*) AS numberOfArticles FROM articlesTestingTable";
    $query .= " WHERE keywords LIKE :keywords";
    $stmt = $db->prepare($query);
    $stmt->bindParam("keywords", $keywords, PDO::PARAM_STR);
    $stmt->execute();
    $data = $stmt->fetch();
    echo $data['numberOfArticles'];
    $stmt->closeCursor();
?>