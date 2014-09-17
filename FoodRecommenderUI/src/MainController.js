FoodRecommender.MainController = (function() {
	var that = {},
	homeScreenView = null, 
	profilView = null, 
	advancedSearchView = null, 
	myRecipesView = null, 
	menuView = null,
	//recommenderView = null, 
	//mainModel = null,

	init = function() {
		mainModel = FoodRecommender.MainModel;
		mainModel.init();

		menuView = FoodRecommender.MenuView.init();
		homeScreenView = FoodRecommender.HomeScreenView.init();
		profilView = FoodRecommender.ProfilView.init();
		advancedSearchView = FoodRecommender.AdvancedSearchView.init();
		myRecipesView = FoodRecommender.MyRecipesView.init();
		//recommenderView = FoodRecommender.RecommenderView.init(); 

		$(menuView).on('homeMenuItemClick', onHomeMenuItemClick);
		$(menuView).on('fastAdviceMenuItemClick', onFastAdviceMenuItemClick);
		$(menuView).on('myRecipesMenuItemClick', onMyRecipesMenuItemClick);
		$(menuView).on('profilMenuItemClick', onProfilMenuItemClick);

		//$(recommenderView).on("getImage", onGetImage); 
	}, 

	onHomeMenuItemClick = function(event) {
		console.log("home");
		emptyContent();
		homeScreenView.addHomeScreenItem();
	}, 

	onFastAdviceMenuItemClick = function(event) {
		console.log("fastAdvice");
		emptyContent();
		advancedSearchView.addAdvancedSearchItem();
	},

	onMyRecipesMenuItemClick = function(event) {
		console.log("myRecipes");
		emptyContent();
		myRecipesView.addMyRecipesItem();
	}, 

	onProfilMenuItemClick = function(event) {
		console.log("profil"); 
		emptyContent();
		profilView.addProfilItem();
	},

	/*onGetImage = function(event, inputURL) {
		mainModel.getImage(inputURL); 
	}, */

	emptyContent = function() {
		$('#content').empty();
	};

	that.init = init;

	return that;
})();