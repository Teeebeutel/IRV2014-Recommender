FoodRecommender.MyRecipesView = (function() {
	var that = {},  

	init = function() {
	  return that; 
	}, 

	addMyRecipesItem = function(username) {
    if(username  != null) {
      makeMyRecipesItem({
        id: "myRecipesItem"
      });
      $(that).trigger('getRecipes'); 
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
  	};

	that.addMyRecipesItem = addMyRecipesItem;
	that.init = init; 
	return that; 
})(); 