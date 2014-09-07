FoodRecommender.ProfilView = (function() {
	var that = {},  

	init = function() {
	  return that; 
	}, 

	addProfilItem = function() {
	    makeProfilItem({
	      id: "profilItem"
	    });
	    console.log("hi");
	}, 

	makeProfilItem = function(options) {
	    console.log(options.id);
	    var item = FoodRecommender.ProfilItem().init({
	      id: options.id
	    });
	    var $el = item.render(); 
	    $('#content').append($el);
	    console.log("make");
	};

	that.addProfilItem = addProfilItem;
	that.init = init; 
	return that; 
})(); 