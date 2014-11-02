FoodRecommender.MainModel = (function() {
	var that = {}; 

	init = function() {
	}, 

	getRecipes = function() {
		$.get("php/functions.php?command=getRecipes").done(
      function(data) {
          var json = data;
          var object = jQuery.parseJSON(json);
          for (var i = 0; i < object.length; i++) {
            $(that).trigger('addRecipeItem', [object[i].id, object[i].recipeId, object[i].title, object[i].instructions, object[i].timeToWork, object[i].vegetarian, object[i].vegan, object[i].antialc, '#myRecipesItem', object[i].imgSrc]);
          }
      });
	}, 

	saveRecipe = function(id, recipeId, title, instructions, timeToWork, vegetarian, vegan, antialc, imgSrc) {
		var data = {id: id, recipeId: recipeId, title: title, instructions: instructions, timeToWork: timeToWork, vegetarian: vegetarian, vegan: vegan, antialc: antialc, imgSrc: imgSrc};
    	$.get("php/functions.php?command=saveRecipe", data);
	}, 

	getProfilData = function(type) {
		$.get("php/functions.php?command=getProfilData").done(
	    function(data) {
	        var object = jQuery.parseJSON(data); 
	        var userName = object['userName']; 
	        var likes = object['likes']; 
	        var dislikes = object['dislikes']; 
	        $(that).trigger('getProfilDataDone', [userName, likes, dislikes, type]); 
	    });
	}, 

	getProfilAndRecipeData = function() {
		$.get("php/functions.php?command=getProfilAndRecipeData").done(
	    function(data) {
	        var object = jQuery.parseJSON(data); 
	        var userName = object['userName']; 
	        var likes = object['likes']; 
	        var dislikes = object['dislikes']; 
	        var recipes = jQuery.parseJSON(object['recipes']); 
	        $(that).trigger('getProfilAndRecipeDataDone', [userName, likes, dislikes, recipes]); 
	    });
	}, 

	saveNewUser = function(username, password) {
		var data = {username: username, password: password};
    	$.get("php/functions.php?command=saveNewUser", data); 
	}; 
	
	that.init = init; 
	that.getRecipes = getRecipes; 
	that.saveRecipe = saveRecipe; 
	that.getProfilData = getProfilData; 
	that.getProfilAndRecipeData = getProfilAndRecipeData; 
	that.saveNewUser = saveNewUser; 

	return that; 
}()); 