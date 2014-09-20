<?php

class DB_Functions {

    private $db;

    //put your code here
    // constructor
    function __construct() {
        include_once './db_connect.php';
        // connecting to database
        $this->db = new DB_Connect();
        $this->db->connect();
    }

    // destructor
    function __destruct() {
        
    }

    /**
     * Storing new user
     * returns user details
     */
    public function saveRecipe($recipeId, $title, $instructions, $timeToWork, $vegetarian, $vegan, $antialc) {
        $result = mysql_query("INSERT INTO FAVOURITE_RECIPE(RECIPE_ID, USER_ID, TITLE, INSTRUCTIONS, TIME_TO_WORK, VEGAN, VEGETARIAN, ANTIALC) VALUES('$recipeId', 1, '$title', '$instructions', '$timeToWork', '$vegan', '$vegetarian', '$antialc')");
        // check for successful store
        /*if ($result) {
            // get user details
            $id = mysql_insert_id(); // last inserted id
            $result = mysql_query("SELECT * FROM gcm_users WHERE id = $id") or die(mysql_error());
            // return user details
            if (mysql_num_rows($result) > 0) {
                return mysql_fetch_array($result);
            } else {
                return false;
            }
        } else {
            return false;
        }*/
    }

}

?>