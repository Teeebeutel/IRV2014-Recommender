FoodRecommender.MyRecipesView = (function() {
	var that = {},  

	init = function() {
	  return that; 
	}, 

	addMyRecipesItem = function() {
	    makeMyRecipesItem({
	      id: "myRecipesItem"
	    });
	    console.log("hi");
	}, 

	makeMyRecipesItem = function(options) {
	    console.log(options.id);
	    var item = FoodRecommender.MyRecipesItem().init({
	      id: options.id
	    });
	    var $el = item.render(); 
	    $('#content').append($el);
	    console.log("make");
	};

	that.addMyRecipesItem = addMyRecipesItem;
	that.init = init; 
	return that; 
})(); 