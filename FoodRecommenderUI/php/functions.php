<?php
	
	include_once './db_functions.php';

    $db = new DB_Functions();


	switch($_GET['command']) {
		case 'getImage':
			$url = $_GET['url'];
			getImage($url);
			break;
		case 'saveRecipe':
			$id  = $_GET['id']; 
			$recipeId  = $_GET['recipeId']; 
			$title = $_GET['title']; 
			$instructions = $_GET['instructions']; 
			$timeToWork = $_GET['timeToWork']; 
			$vegetarian = $_GET['vegetarian'];
			$vegan = $_GET['vegan']; 
			$antialc = $_GET['antialc']; 
			$imgSrc = $_GET['imgSrc'];
			$res = $db->saveRecipe($id, $recipeId, $title, $instructions, $timeToWork, $vegetarian, $vegan, $antialc, $imgSrc);
			break;
		case 'getRecipes': 
			$res = $db->getRecipes();
			break; 
		case 'saveNewUser':     
            $username = $_GET['username'];
            $password = $_GET['password'];
            $db->saveNewUser($username, $password); 
            break; 
        case 'checkUser': 
            $username = $_GET['username'];
            $password = $_GET['password'];
            $db->checkUser($username, $password); 
            break; 
        case 'saveIngredient': 
        	$value = $_GET['value'];
        	$kind = $_GET['kind'];
        	$db->saveIngredient($value, $kind); 
        	break;
        case 'deleteIngredient': 
        	$value = $_GET['value'];
        	$kind = $_GET['kind'];
        	$db->deleteIngredient($value, $kind);
        	break; 
        case 'getProfilData':
        	$db->getProfilData();
        	break;
        case 'getProfilAndRecipeData': 
        	$db->getProfilAndRecipeData(); 
		default: 
			return;
	}

	function getImage($url) {
		require '../libs/simplehtmldom_1_5/simple_html_dom.php';
		$html = file_get_html($url);
		$result = "res/images/noImage.png"; 
		if(!empty($html)) {
			if ($html->find('#recipe-no-picture')) {
				$result = "res/images/noImage.png";
			} else {
				$result = $html->find('#slideshow a', 0)->href; 
			}
		}
		print_r($result);
	}
	
?>