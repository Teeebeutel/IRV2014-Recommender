UserHandler = (function() {
	var that = {},
	preferences = {
		"likes":[],
		"dislikes":[],
		"concepts":[]
	},
	currentID,

	init = function (argument) {
		/*get user id here*/
		currentID = getCurrentUserID();
		/*now get user concepts*/
		getPreferencesFromDb();
		console.log("initiated user Agent");
		userListeners();
	},

	userListeners = function (){
		$('body').off('userConceptChanged');
		$('body').off('userLikesChanged');
		$('body').off('userDislikesChanged');

		$('body').on('userConceptChanged', onUserConceptChanged);
		$('body').on('userLikesChanged', onUserLikesChanged);
		$('body').on('userDislikesChanged', onUserDislikesChanged);
	},

	getCurrentUserID = function(){
		console.log("gettingCurrentUserID");
		return 1;
	},

	getPreferencesFromDb = function(){
		preferences.concepts = getConcepts();
		preferences.dislikes = getDislikes();
		preferences.likes = getLikes();
	},
	
	getConcepts = function(){
		/*add 'SELECT a.CONCEPT_NAME FROM concepts as a, user_concepts as b WHERE b.USER_ID = '+getCurrentUserID()+' a.CONCEPT_ID = b.CONCEPT_ID'*/
		toReturn = [];
		return toReturn;
	},
	
	getDislikes = function(){
		/*add 'SELECT INGREDIENT_NAME FROM ingredients_dislikes WHERE USER_ID = '+getCurrentUserID()*/
		toReturn = ["öl","koriander"];
		return toReturn;
	},
	
	getLikes = function(){
		/*add 'SELECT INGREDIENT_NAME FROM ingredients_likes WHERE USER_ID = '+getCurrentUserID()*/
		toReturn = ["wurst","brot"];
		return toReturn;
	},

	addPreferences = function (Manager) {
		console.log("added preferences to", Manager);
		for(item in preferences.dislikes){
			Manager.store.addByValue('fq','!ingredientname:'+preferences.dislikes[item]);
		}
		for(item in preferences.likes){
			//console.log(added to )
			Manager.store.addByValue('fq','ingredientname:'+preferences.likes[item]);
		}
		for(item in preferences.concepts){
			/*potentially failing if not formatted correctly, need to check*/
			Manager.store.addByValue('fq',preferences.concepts[item]+':true');
		}
	},

	onUserConceptChanged= function () {

	},
	
	onUserLikesChanged= function () {

	},
	
	onUserDislikesChanged= function () {

	};

	that.init = init;
	that.addPreferences = addPreferences;

	return that;
})();
