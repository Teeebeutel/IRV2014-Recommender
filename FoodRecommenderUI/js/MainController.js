FoodRecommender.MainController = (function() {
	var that = {},
	homeScreenView = null, 
	profilView = null, 
	advancedSearchView = null, 
	myRecipesView = null, 
	menuView = null,
  recipeView = null, 
  notLoggedInView = null, 
	firstProfilLoad, userName, 
	mainModel = null,

	init = function() {
		mainModel = FoodRecommender.MainModel;
		mainModel.init();

		menuView = FoodRecommender.MenuView.init();
		homeScreenView = FoodRecommender.HomeScreenView.init();
		profilView = FoodRecommender.ProfilView.init();
		loginView = FoodRecommender.LoginView.init(); 
		advancedSearchView = FoodRecommender.AdvancedSearchView.init();
		myRecipesView = FoodRecommender.MyRecipesView.init(); 
    recipeView = FoodRecommender.RecipeView.init(); 
    notLoggedInView = FoodRecommender.NotLoggedInView.init(); 

		$(menuView).on('homeMenuItemClick', onHomeMenuItemClick);
		$(menuView).on('fastAdviceMenuItemClick', onFastAdviceMenuItemClick);
		$(menuView).on('myRecipesMenuItemClick', onMyRecipesMenuItemClick);
		$(menuView).on('profilMenuItemClick', onProfilMenuItemClick);

    $(loginView).on('loggedIn', onLoggedIn); 
    $(loginView).on('useWithoutLogin', onUseWithoutLogin); 
    $(loginView).on('registrationButtonClick', onRegistrationButtonClick); 

    $(homeScreenView).on('preselectionSearchButtonClick', onPreselectionSearchButtonClick); 

    $(myRecipesView).on('addNotLoggedInView', onAddNotLoggedInView); 
    $(myRecipesView).on('markAsFavourite', onMarkAsFavourite); 
    $(myRecipesView).on('showRecipes', onShowRecipes); 

    $(recipeView).on('saveRecipe', onSaveRecipe); 
    $(recipeView).on('checkIfRecipeSavedJet', onCheckIfRecipeSavedJet); 
    $(profilView).on('addNotLoggedInView', onAddNotLoggedInView); 

    $(notLoggedInView).on('loginButtonClick', onLoginButtonClick); 

    $(advancedSearchView).on('addAutocompleteWidget', onAddAutocompleteWidget); 
    $(advancedSearchView).on('adaptSearchToSearchType', onAdaptSearchToSearchType); 
    $(advancedSearchView).on('adaptSearchToPreselection', onAdaptSearchToPreselection); 
    $(advancedSearchView).on('nutritionConceptDeselect', onNutritionConceptDeselect); 
    $(advancedSearchView).on('addValueToManager', onAddValueToManager); 
    $(advancedSearchView).on('doRequest', onDoRequest); 

    $(mainModel).on('addRecipeItem', onAddRecipeItem); 
    $(mainModel).on('getProfilAndRecipeDataDone', onGetProfilandRecipeDataDone); 

		initUI();
	}, 

  onRegistrationButtonClick = function(event, username, password) {
    initManager(); 
    userName = username; 
    mainModel.saveNewUser(username, password); 
    profilView.initManagers(); 
  }, 

  onMarkAsFavourite = function(event, recipeContainer) {
    $(recipeContainer).find('.addToFavouritesBtn').css('color', "#ffc107");
  }, 

  onCheckIfRecipeSavedJet = function(event, recipeId, recipeContainer) {
    myRecipesView.isRecipeExistent(recipeId,recipeContainer); 
  }, 

  onAddValueToManager = function(event, value) {
    Manager.store.addByValue('rows', value);
    Manager.doRequest(0, 'recipeCollection/select');
  }, 

  onNutritionConceptDeselect = function(event) {
    Manager.store.removeByValue('fq', new RegExp('^vegetarian:'));
    Manager.store.removeByValue('fq', new RegExp('^vegan:'));
    Manager.store.removeByValue('fq', new RegExp('^antialc:'));
    Manager.doRequest(0, 'recipeCollection/select');
  }, 

  onDoRequest = function(event) {
    Manager.doRequest(0, 'recipeCollection/select');
  }, 

  onShowRecipes = function(event, savedRecipes) {
   console.log(savedRecipes.length);
    for (var i = 0; i < savedRecipes.length; i++) {
        recipeView.addRecipeItem(savedRecipes[i].id, savedRecipes[i].recipeId, savedRecipes[i].title, savedRecipes[i].instructions, savedRecipes[i].timeToWork, savedRecipes[i].vegetarian, savedRecipes[i].vegan, savedRecipes[i].antialc, '#myRecipesItem', savedRecipes[i].imgSrc);
    }
  }, 

  onAdaptSearchToPreselection = function(event, selectedItems) {
    Manager.store.remove('fq');
    Manager.store.addByValue('q', '*:*');
    for(var i = 0; i < selectedItems.length; i++) {
      var id = selectedItems[i]; 
          if(id != "type:none" && id != "timetowork:none" && id != "requiredSkill:none" && id != "vegetarian:none") {
            Manager.store.addByValue('fq', id);
          }
    }
    startProfilBasedSearch(); 
  }, 

  startProfilBasedSearch = function() {
    var likes = profilView.getLikes(); 
    var dislikes = profilView.getDislikes();
    console.log(likes); 
    console.log(dislikes); 
    addUserPreferences(likes, dislikes);
    Manager.doRequest(0, 'recipeCollection/select');
  }, 

  onAdaptSearchToSearchType = function(event, selection) {
    var likes = profilView.getLikes(); 
    var dislikes = profilView.getDislikes();
    if(selection == "profilbezogen") {
      addUserPreferences(likes, dislikes);
    } else if(selection == "frei") { 
      Manager.store.addByValue('q', '*:*');
      for (var i = 0; i < dislikes.length; i++) {
        Manager.store.removeByValue('fq', new RegExp("!ingredientname:" + dislikes[i]));
      }
    } 
  }, 

  onAddAutocompleteWidget = function(event) {
    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
          id: 'addField',
          target: '#addField',
          fields: ['ingredientname']
        }));
  }, 

  initManager = function() {
    Manager = new AjaxSolr.Manager({
        solrUrl: 'http://localhost:8983/solr/' 
      });
      Manager.addWidget(new AjaxSolr.ResultWidget({
        id: 'result',
        target: '#docs'
      }));
      Manager.addWidget(new AjaxSolr.PagerWidget({
        id: 'pager',
        target: '#pager',
        prevLabel: '&lt;',
        nextLabel: '&gt;',
        innerWindow: 1
      }));
      Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
        id: 'currentsearch',
        target: '#selection'
      }));
      Manager.addWidget(new AjaxSolr.AutocompleteWidget({
        id: 'text',
        target: '#search',
        fields: ['titleStop', 'ingredientname'], 
        multivalue: true
      }));
      Manager.addWidget(new AjaxSolr.KindOfMenuWidget({
        id: 'kindOfMenuSelector',
        target: '#kindOfMenuSelector',
        field: 'type'
      }));
      var fields = ['vegetarian', 'vegan', 'antialc'];
      for (var i = 0, l = fields.length; i < l; i++) {
        Manager.addWidget(new AjaxSolr.NutritionConceptWidget({
          id: fields[i],
          target: '#' + fields[i], 
          field: fields[i]
        }));
      }
      Manager.addWidget(new AjaxSolr.DurationWidget({
        id: 'durationSelect',
        target: '#durationSelect',
        field: 'timetowork'
      }));
      Manager.addWidget(new AjaxSolr.LevelOfDifficultyWidget({
        id: 'levelOfDifficultySelector',
        target: '#levelOfDifficultySelector',
        field: 'requiredSkill'
      }));
      Manager.init();
      Manager.store.addByValue('q', '*:*');
      var params = {
        facet: true,
        'facet.limit': 20,
        'facet.mincount': 1,
        'json.nl': 'map', 
        'rows': 10
      };
      for (var name in params) {
        Manager.store.addByValue(name, params[name]);
      }
      
      startProfilBasedSearch(); 
  },

	initUI = function() {
    firstProfilLoad = true; 
  },

  onGetProfilandRecipeDataDone = function(event, username, likes, dislikes, recipes) {
    getProfilDataDone(username, likes, dislikes); 
    getRecipeDataDone(recipes); 
  }, 
  
  getRecipeDataDone = function(recipes) {
    myRecipesView.setRecipes(recipes);
  }, 

  getProfilDataDone = function(username, likes, dislikes) {
    var type = $('#content > div:first-of-type').attr('id'); 
    userName = username; 
    profilView.setIngredients(likes, dislikes); 
    if(type == "myRecipesItem") {
      emptyContent(); 
      myRecipesView.addMyRecipesItem(username);
    } if(type == "profilItem") {
      emptyContent(); 
      profilView.addProfilItem(username, likes, dislikes); 
    }
    initManager(); 
    profilView.initManagers(); 
  }, 

  onSaveRecipe = function(event, id, recipeId, title, instructions, timeToWork, vegetarian, vegan, antialc, imgSrc) {
    myRecipesView.addRecipe(id, recipeId, title, instructions, timeToWork, vegetarian, vegan, antialc, imgSrc); 
    mainModel.saveRecipe(id, recipeId, title, instructions, timeToWork, vegetarian, vegan, antialc, imgSrc);
  }, 

  onAddNotLoggedInView = function(event, text) {
    notLoggedInView.addNotLoggedInView(text); 
  }, 

  onLoginButtonClick = function(event) {
    loginView.showOverlay(); 
  }, 

  onLoggedIn = function(event) {
    mainModel.getProfilAndRecipeData(); 
  }, 

  onUseWithoutLogin = function() {
    initManager(); 
    userName = null; 
  }, 

  onPreselectionSearchButtonClick = function(event, selectedItems, kindOfMenuNr, nutritionConceptNr, durationValue, levelOfDifficultyNr) {
    emptyContent();
    advancedSearchView.startPreselectionSearch(selectedItems, kindOfMenuNr, nutritionConceptNr, durationValue, levelOfDifficultyNr);
  }, 

  onAddRecipeItem = function(event, id, recipeId, title, instructions, timeToWork, isVegetarian, isVegan, isAntialc, container, imgSrc) {
    recipeView.addRecipeItem(id, recipeId, title, instructions, timeToWork, isVegetarian, isVegan, isAntialc, container, imgSrc);
  }, 

  addUserPreferences = function (likes, dislikes) {
    var likesString = ""; 
    for(item in dislikes){
      Manager.store.addByValue('fq','!ingredientname:'+dislikes[item]);
    }
    for(item in likes){
      likesString += ('ingredientname:' + likes[item] + " OR "); 
    }
    likesString = likesString.substring(0, likesString.length-4); 
    Manager.store.addByValue('q', likesString); 
  },

  onHomeMenuItemClick = function(event) {
    emptyContent();
    homeScreenView.addHomeScreenItem();
  },

  onFastAdviceMenuItemClick = function(event) {
    emptyContent();
    advancedSearchView.addAdvancedSearchItem(-1, 0, 0, 0);
  },

  onMyRecipesMenuItemClick = function(event) {
    emptyContent();
    myRecipesView.addMyRecipesItem(userName);
  }, 

  onProfilMenuItemClick = function(event) {
    emptyContent();
    getProfilInformation();
  },

  getProfilInformation = function() {
    profilView.addProfilItem(userName, profilView.getLikes(), profilView.getDislikes()); 
  },

  onKeyUpInSearchField = function(event) {
    if(event.which == 13) {
      emptyContent();
      advancedSearchView.addAdvancedSearchItem(-1, 0, 0, 0);
    }
  },

  emptyContent = function() {
    $('#content').empty();
  };

	that.init = init;

	return that;
})();