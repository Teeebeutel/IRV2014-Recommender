FoodRecommender.MenuView = (function() {
	var that = {}, 

	init = function() {

		$('#homeMenuItem').on('click', onHomeMenuItemClick); 
		$('#fastAdviceMenuItem').on('click', onFastAdviceMenuItemClick); 
		$('#myRecipesMenuItem').on('click', onMyRecipesMenuItemClick); 
		$('#profilMenuItem').on('click', onProfilMenuItemClick); 
		return that; 
	}, 

	onHomeMenuItemClick = function(event) {
		$(that).trigger('homeMenuItemClick'); 
	}, 

	onFastAdviceMenuItemClick = function(event) {
		$(that).trigger('fastAdviceMenuItemClick'); 
	}, 

	onMyRecipesMenuItemClick = function(event) {
		$(that).trigger('myRecipesMenuItemClick'); 
	}, 

	onProfilMenuItemClick = function(event) {
		$(that).trigger('profilMenuItemClick'); 
	};

	that.init = init; 

	return that; 

})(); 