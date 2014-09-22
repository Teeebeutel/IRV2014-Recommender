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
		default: 
			return;
	}

	function getImage($url) {
		require '../libs/simplehtmldom_1_5/simple_html_dom.php';
		$html = file_get_html($url);
		$result; 
		if ($html->find('#recipe-no-picture')) {
			$result = "res/images/noImage.png";
		} else {
			$result = $html->find('#slideshow a', 0)->href; 
		}
		print_r($result);
	}
	
?>