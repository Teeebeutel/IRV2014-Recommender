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
    console.log("hi");
  }, 

  makeHomeScreenItem = function(options) {
    console.log(options.id);
    var item = FoodRecommender.HomeScreenItem().init({
      id: options.id
    });
    var $el = item.render(); 
    $('#content').append($el);
    console.log("make");
  };

  that.addHomeScreenItem = addHomeScreenItem;
	that.init = init; 
	return that; 
})(); 