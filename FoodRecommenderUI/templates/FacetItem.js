FacetItem = function() {
	var that  = {}, 
	template  = null, 
	id = null, 
	title = null, 

	init = function(options) {
		id = options.id; 
		title = options.title; 

		template = $('#facet-tpl').html(); 

		return that; 
	}, 

	render = function() {
		var tpl = _.template(template, {
			id: id, 
			title: title
		}); 

		return $(tpl); 
	}; 
	
	that.init = init; 
	that.render = render; 

	return that; 
}; 