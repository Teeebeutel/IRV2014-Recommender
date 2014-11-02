FoodRecommender.AdvancedSearchView = (function() {
	var that = {}, 
	selected = null,  

	init = function() {
	  	return that; 
	}, 

	addAdvancedSearchItem = function(kindOfMenuNr, nutritionConceptNr, durationValue, levelOfDifficultyNr) {
		addItem(kindOfMenuNr, nutritionConceptNr, durationValue, levelOfDifficultyNr); 
	    
      	$(that).trigger('doRequest'); 
      	initEventHandler(); 
  	},

  	addItem = function(kindOfMenuNr, nutritionConceptNr, durationValue, levelOfDifficultyNr) {
  		makeAdvancedSearchItem({
	        id: "advancedSearchItem", 
	        kindOfMenuNr: kindOfMenuNr, 
	        nutritionConceptNr: nutritionConceptNr, 
	        durationValue: durationValue, 
	        levelOfDifficultyNr: levelOfDifficultyNr
	    });
    	if(kindOfMenuNr != -1) {
        	$('.kindOfMenuContainer:eq(' + kindOfMenuNr +')').append('<div class="selectionMark"><div class="iconDiv"></div><core-icon icon="check"></core-icon></div>');
    	}
      
    	$('#menuButton').show().on('click', onMenuButtonClick); 
    	$(that).trigger('addAutocompleteWidget'); 
      	adaptSearchToSearchType(selected);
    }, 

  	initEventHandler = function() {
  		$('#countSelect').on('click', 'core-item', onCountSelectChange);
      	$('#noNutritionConcept').on('click', onNutritionConceptDeselect);
      	$('#searchTypeSelect').on('click', 'core-item', onSearchTypeSelectChange);
    }, 

	startPreselectionSearch = function(selectedItems, kindOfMenuNr, nutritionConceptNr, durationValue, levelOfDifficultyNr) {
		addItem(kindOfMenuNr, nutritionConceptNr, durationValue, levelOfDifficultyNr); 
		$(that).trigger('adaptSearchToPreselection', [selectedItems]); 

		initEventHandler(); 
	}, 

	onMenuButtonClick = function(event) {
      	var drawerPanel = document.getElementById('drawerPanel');
      	drawerPanel.togglePanel();
  	},

  	onSearchTypeSelectChange = function(event) {
    	var newSelection = $(event.currentTarget).attr('id'); 
    	selected = newSelection; 
    	adaptSearchToSearchType(newSelection); 
    	$(that).trigger('doRequest'); 
  	},

  	onNutritionConceptDeselect = function(event) {
  		$(that).trigger('nutritionConceptDeselect'); 
  	},

  	adaptSearchToSearchType = function(selection) {
  		$(that).trigger('adaptSearchToSearchType', [selection]); 
  	},

  	onCountSelectChange = function(event) {
    	var value = $(event.currentTarget).attr('label');
    	$(that).trigger('addValueToManager', [value]); 
  	},

  	makeAdvancedSearchItem = function(options) {
      	var item = AdvancedSearchItem().init({
        	id: options.id, 
        	kindOfMenuNr: options.kindOfMenuNr, 
        	nutritionConceptNr: options.nutritionConceptNr, 
        	durationValue: options.durationValue, 
        	levelOfDifficultyNr: options.levelOfDifficultyNr
      	});
      	var $el = item.render(); 
      	$('#content').append($el);
  	};

  	that.addAdvancedSearchItem = addAdvancedSearchItem;
  	that.startPreselectionSearch = startPreselectionSearch; 
	that.init = init; 
	return that; 
})(); 