FoodRecommender.HomeScreenView = (function() {
	var that = {},  

	init = function() {
    addHomeScreenItem();
	  return that; 
	}, 

  addHomeScreenItem = function() {
    makeHomeScreenItem({
      id: "homeScreenItem"
    });
  }, 

  makeHomeScreenItem = function(options) {
    console.log(options.id);
    var item = FoodRecommender.HomeScreenItem().init({
      id: options.id
    });
    var $el = item.render(); 
    $('#content').append($el);
  };

  that.addHomeScreenItem = addHomeScreenItem;
	that.init = init; 
	return that; 
})(); 