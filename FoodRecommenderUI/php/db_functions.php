<?php

class DB_Functions {

    private $db;

    function __construct() {
        include_once './db_connect.php';
      
        $this->db = new DB_Connect();
        $this->db->connect();
    }

    function __destruct() {
        
    }

    public function saveRecipe($recipeId, $title, $instructions, $timeToWork, $vegetarian, $vegan, $antialc) {
        $result = mysql_query("INSERT INTO FAVOURITE_RECIPE(RECIPE_ID, USER_ID, TITLE, INSTRUCTIONS, TIME_TO_WORK, VEGAN, VEGETARIAN, ANTIALC) VALUES('$recipeId', 1, '$title', '$instructions', '$timeToWork', '$vegan', '$vegetarian', '$antialc')");
    }

}

?>