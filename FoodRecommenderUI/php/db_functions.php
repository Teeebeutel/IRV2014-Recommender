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

    public function saveRecipe($id, $recipeId, $title, $instructions, $timeToWork, $vegetarian, $vegan, $antialc, $imgSrc) {
        $result = mysql_query("INSERT INTO FAVOURITE_RECIPE(ID, RECIPE_ID, USER_ID, TITLE, INSTRUCTIONS, TIME_TO_WORK, VEGAN, VEGETARIAN, ANTIALC, IMG_SRC) VALUES('$id', '$recipeId', 1, '$title', '$instructions', '$timeToWork', '$vegan', '$vegetarian', '$antialc', '$imgSrc');");
    }

    public function getRecipes() {
        $result = mysql_query("SELECT * FROM FAVOURITE_RECIPE;") or die(mysql_error());
        $recipes = array();
        while($row = mysql_fetch_array($result)) {
            $recipes[] = array("id"=>$row['ID'], "recipeId"=>$row['RECIPE_ID'], "userId"=>$row['USER_ID'], "title"=>$row['TITLE'], "instructions"=>$row['INSTRUCTIONS'], "timeToWork"=>$row['TIME_TO_WORK'], "vegan"=>$row['VEGAN'], "vegetarian"=>$row['VEGETARIAN'], "antialc"=>$row['ANTIALC'], "imgSrc"=>$row['IMG_SRC']);
        }
        echo $this->jsonRemoveUnicodeSequences($recipes);
    }

    function jsonRemoveUnicodeSequences($struct) {
        $struct = preg_replace('/(\\\\n|\\\\t)/', ' ', json_encode($struct));
        return preg_replace("/\\\\u([a-f0-9]{4})/e", "iconv('UCS-4LE','UTF-8',pack('V', hexdec('U$1')))", $struct);
    }


}

?>