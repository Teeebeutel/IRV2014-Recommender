FoodRecommender.MyRecipesView = (function() {
	var that = {},  
  savedRecipes = []; 

	init = function() {
	  return that; 
	}, 

	addMyRecipesItem = function(username) {
    if(username  != null) {
      makeMyRecipesItem({
        id: "myRecipesItem"
      });
      getRecipes(); 
    } else {
      var text = "Rezepte abspeichern."; 
      $(that).trigger('addNotLoggedInView', [text]); 
    }
      $('#menuButton').hide();
  	},

  	makeMyRecipesItem = function(options) {
      	var item = MyRecipesItem().init({
        	id: options.id
      	});
      	var $el = item.render(); 
      	$('#content').append($el);
  	}, 

    setRecipes = function(recipes) {
      savedRecipes = recipes; 
    }, 

    getRecipes = function() {
      $(that).trigger('showRecipes', [savedRecipes]); 
    }, 

    addRecipe = function(id, recipeId, title, instructions, timeToWork, vegetarian, vegan, antialc, imgSrc) {
      var newRecipeObject = {id: id, recipeId: recipeId, title: title, instructions: instructions, timeToWork: timeToWork, vegetarian: vegetarian, vegan: vegan, antialc: antialc, imgSrc: imgSrc}; 
      console.log(newRecipeObject); 
      savedRecipes.push(newRecipeObject); 
    };

	that.addMyRecipesItem = addMyRecipesItem;
  that.getRecipes = getRecipes; 
  that.setRecipes = setRecipes; 
  that.addRecipe = addRecipe; 
	that.init = init; 
	return that; 
})(); 