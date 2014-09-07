FoodRecommender.AdvancedSearchView = (function() {
	var that = {},  

	init = function() {
	  return that; 
	}, 

	addAdvancedSearchItem = function() {
	    makeAdvancedSearchItem({
	      id: "advancedSearchItem"
	    });
	    $('.kindOfMenuContainer').on('click', onSelectedItemChange);
	}, 

	makeAdvancedSearchItem = function(options) {
	    console.log(options.id);
	    var item = FoodRecommender.AdvancedSearchItem().init({
	      id: options.id
	    });
	    var $el = item.render(); 
	    $('#content').append($el);
	}, 

	onSelectedItemChange = function(event) {
		$('#kindOfMenuSelector').find('.core-selected').find('.selectionMark').remove();
		$(event.currentTarget).append('<div class="selectionMark"><div class="iconDiv"></div><core-icon icon="check"></core-icon></div>');
	};

  	that.addAdvancedSearchItem = addAdvancedSearchItem;
	that.init = init; 
	return that; 
})(); 