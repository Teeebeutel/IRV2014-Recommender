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
        $userId = $_SESSION['currentUserId']; 
        $result = mysql_query("INSERT INTO FAVOURITE_RECIPE(ID, Recipe_ID, Title, Instructions, Time_To_Work, Vegan, Vegetarian, Antialc, Img_Src, User_ID) VALUES('$id', '$recipeId', '$title', '$instructions', '$timeToWork', '$vegan', '$vegetarian', '$antialc', '$imgSrc', '$userId');");
    }

    public function getRecipes() {
        $result = mysql_query("SELECT * FROM FAVOURITE_RECIPE;") or die(mysql_error());
        $recipes = array();
        while($row = mysql_fetch_array($result)) {
            $recipes[] = array("id"=>$row['ID'], "recipeId"=>$row['Recipe_ID'], "userId"=>$row['User_ID'], "title"=>$row['Title'], "instructions"=>$row['Instructions'], "timeToWork"=>$row['Time_To_Work'], "vegan"=>$row['Vegan'], "vegetarian"=>$row['Vegetarian'], "antialc"=>$row['Antialc'], "imgSrc"=>$row['Img_Src']);
        }
        echo $this->jsonRemoveUnicodeSequences($recipes);
    }

    function jsonRemoveUnicodeSequences($struct) {
        $struct = preg_replace('/(\\\\n|\\\\t)/', ' ', json_encode($struct));
        return preg_replace("/\\\\u([a-f0-9]{4})/e", "iconv('UCS-4LE','UTF-8',pack('V', hexdec('U$1')))", $struct);
    }

    /*saves username and password of a new registered user*/
    public function saveNewUser($username, $password) {
        $cryptedPassword = crypt($password, "§4$q&%weq35gd(g!");
        $userResult = mysql_query("INSERT INTO USER (User_Name, Password) VALUES ('$username', '$cryptedPassword');");
        $userId = mysql_insert_id();
        $_SESSION['currentUserId'] = $userId; 
        echo $_SESSION['currentUserId'];
    }

    /*checks if the username and the corresponding password is existing in the database*/
    public function checkUser($username, $password) {
        $cryptedPassword = crypt($password, "§4$q&%weq35gd(g!");
        $userResult = mysql_query("SELECT * FROM USER WHERE User_Name='$username' AND Password='$cryptedPassword';");
        if (mysql_num_rows($userResult) > 0) {
            $userRow = mysql_fetch_array($userResult); 
            if($userRow['Password'] == $cryptedPassword) {
                $_SESSION['currentUserId'] = $userRow['User_ID'];
                echo "right";
            } else echo "wrong";
        } else {
            echo "wrong"; 
        }
    }


}

?>