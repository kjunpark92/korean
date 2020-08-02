<?php 
    include('allAccessHeaders.php');
    include('databaseConnect.php');

    //To prevent naughtiness from users
    $comment = nl2br(addslashes(htmlspecialchars(htmlentities(trim($_POST['comment'])))));
    $nickname = addslashes(htmlspecialchars(htmlentities(trim($_POST['nickname']))));
    $articleID = $_POST['articleID'];
    //post the comments to the server
    $entries = 'INSERT INTO commentsTestingTable(id_articles, author, comment, date_comment) VALUES(:id_article, :author, :comment, NOW())';
    try {
        $response = $db->prepare($entries);
        $response ->execute(
            array(
                "id_article"=> $articleID,
                "author"=> $nickname,
                "comment" => $comment,
            )
        );
        echo json_encode("Data sent");
    }

    catch(Exception $e) { 
        die('Error: ' . $e->getMessage());  
        echo json_encode("Data NOT sent, please check the code!");
    }
?>