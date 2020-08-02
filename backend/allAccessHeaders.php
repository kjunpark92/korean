<?php
//Insecure headers!! NOT TO GO INTO PRODUCTION
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
  header("Access-Control-Allow-Headers: AccountKey,x-requested-with, Content-Type, origin, authorization, accept, client-security-token, host, date, cookie, cookie2");
  header('Access-Control-Allow-Credentials', 'true');
  header('Access-Control-Max-Age', '60');
?>