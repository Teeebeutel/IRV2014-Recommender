RecipeItem = function() {
	var that  = {}, 
	template  = null, 
	resultId = null, 
	recipeId = null, 
	title = null, 
	id = null,
	snippet = null, 
	images = null,  

	init = function(options) {
		resultId = options.resultId;
		recipeId = options.recipeId;
		title = options.title; 
		id = options.id; 
		snippet = options.snippet; 
		images = options.images; 

		template = $('#recipe-tpl').html(); 

		return that; 
	}, 

	render = function() {
		var tpl = _.template(template, {
			resultId: resultId, 
			recipeId: recipeId, 
			title: title,
			id: id, 
			snippet: snippet, 
			images: images
		}); 

		return $(tpl); 
	}; 
	that.init = init; 
	that.render = render; 

	return that; 
}; 