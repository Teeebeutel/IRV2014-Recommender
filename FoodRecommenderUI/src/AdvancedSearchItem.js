FoodRecommender.AdvancedSearchItem = function() {
	var that  = {}, 
	template  = null, 
	id = null, 

	init = function(options) {
		id = options.id; 

		template = $('#advancedSearch-tpl').html(); 

		return that; 
	}, 

	render = function() {
		var tpl = _.template(template, {
			id: id
		}); 

		return $(tpl); 
	}; 
	that.init = init; 
	that.render = render; 

	return that; 
}; 