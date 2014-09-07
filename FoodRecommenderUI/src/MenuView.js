FoodRecommender.MenuView = (function() {
	var that = {}, 

	init = function() {

		/*$('#menuButton').on('click', onMenuButtonClick); */
		$('#homeMenuItem').on('click', onHomeMenuItemClick); 
		$('#fastAdviceMenuItem').on('click', onFastAdviceMenuItemClick); 
		$('#myRecipesMenuItem').on('click', onMyRecipesMenuItemClick); 
		$('#profilMenuItem').on('click', onProfilMenuItemClick); 
		return that; 
	}, 

	/*onMenuButtonClick = function(event) {
	    var drawerPanel = document.getElementById('drawerPanel');
		drawerPanel.togglePanel();
		console.log("menu click"); 
	}, */

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