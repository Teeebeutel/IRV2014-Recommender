FoodRecommender.ProfilItem = function() {
	var that  = {}, 
	template  = null, 
	id = null, 

	init = function(options) {
		console.log("hi");
		id = options.id; 

		template = $('#profil-tpl').html(); 

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