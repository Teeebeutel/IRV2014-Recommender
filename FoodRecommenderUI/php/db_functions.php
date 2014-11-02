<?php

session_start();


class DB_Functions {

    private $db;

    function __construct() {
        include_once './db_connect.php';
      
        $this->db = new DB_Connect();
        $this->db->connect();
    }

    function __destruct() {
        
    }

    function jsonRemoveUnicodeSequences($struct) {
        $struct = preg_replace('/(\\\\n|\\\\t)/', ' ', json_encode($struct));
        return preg_replace("/\\\\u([a-f0-9]{4})/e", "iconv('UCS-4LE','UTF-8',pack('V', hexdec('U$1')))", $struct);
    }

    /*saves a recipe in the database*/
    public function saveRecipe($id, $recipeId, $title, $instructions, $timeToWork, $vegetarian, $vegan, $antialc, $imgSrc) {
        $userId = $_SESSION['currentUserId']; 
        $result = mysql_query("INSERT INTO FAVOURITE_RECIPE(ID, Recipe_ID, Title, Instructions, Time_To_Work, Vegan, Vegetarian, Antialc, Img_Src, User_ID) VALUES('$id', '$recipeId', '$title', '$instructions', '$timeToWork', '$vegan', '$vegetarian', '$antialc', '$imgSrc', '$userId');");
    }

    /*gets all informations necessary to show the profilscreen (username, likes and dislikes)*/
    public function getProfilData() {
        $userId = $_SESSION['currentUserId']; 
        $likes = array();
        $dislikes = array();
        $userResult = mysql_query("SELECT User_Name FROM USER WHERE User_ID='$userId';");
        $ingredientsLikesResult = mysql_query("SELECT Ingredient_Name FROM INGREDIENTS_LIKES WHERE User_ID='$userId';");
        $ingredientsDislikesResult = mysql_query("SELECT Ingredient_Name FROM INGREDIENTS_DISLIKES WHERE User_ID='$userId';");

        $userRow = mysql_fetch_array($userResult); 
        $userName = $userRow['User_Name']; 
        while($likesRow = mysql_fetch_array($ingredientsLikesResult)) {
            $likes[] = $likesRow['Ingredient_Name'];
        }
        while($dislikesRow = mysql_fetch_array($ingredientsDislikesResult)) {
            $dislikes[] = $dislikesRow['Ingredient_Name'];
        }
        $result = array("userName"=>$userName, "likes"=>$likes, "dislikes"=>$dislikes);
        echo json_encode($result); 
    }

    /*gets all saved recipes from this user*/
    public function getRecipes() {
        $userId = $_SESSION['currentUserId']; 
        $result = mysql_query("SELECT * FROM FAVOURITE_RECIPE WHERE User_ID='$userId';") or die(mysql_error());
        $recipes = array();
        while($row = mysql_fetch_array($result)) {
            $recipes[] = array("id"=>$row['ID'], "recipeId"=>$row['Recipe_ID'], "userId"=>$row['User_ID'], "title"=>$row['Title'], "instructions"=>$row['Instructions'], "timeToWork"=>$row['Time_To_Work'], "vegan"=>$row['Vegan'], "vegetarian"=>$row['Vegetarian'], "antialc"=>$row['Antialc'], "imgSrc"=>$row['Img_Src']);
        }
        echo $this->jsonRemoveUnicodeSequences($recipes);
    }
    /*saves ingredients likes or dislikes added in the profil*/
    public function saveIngredient($value, $kind) {
        $userId = $_SESSION['currentUserId']; 
        if($kind == "ingredientsLikes") {
            $ingredientResult = mysql_query("INSERT INTO INGREDIENTS_LIKES (User_ID, Ingredient_Name) VALUES ('$userId', '$value');");
        } else if($kind == "ingredientsDislikes") {
            $ingredientResult = mysql_query("INSERT INTO INGREDIENTS_DISLIKES (User_ID, Ingredient_Name) VALUES ('$userId', '$value');");
        }
    }

    /*delete ingredients likes or dislikes from the profil*/
    public function deleteIngredient($value, $kind) {
        if($kind == "ingredientsLikes") {
            $ingredientResult = mysql_query("DELETE FROM INGREDIENTS_LIKES WHERE Ingredient_Name = '$value';");
        } else if($kind == "ingredientsDislikes") {
            $ingredientResult = mysql_query("DELETE FROM INGREDIENTS_DISLIKES WHERE Ingredient_Name = '$value';");
        }
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