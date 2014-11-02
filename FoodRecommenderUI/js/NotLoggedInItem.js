NotLoggedInItem = function() {
	var that  = {}, 
	template  = null, 
	id = null, 
	text = null, 

	init = function(options) {
		id = options.id; 
		text = options.text; 

		template = $('#notLoggedIn-tpl').html(); 

		return that; 
	}, 

	render = function() {
		var tpl = _.template(template, {
			id: id, 
			text: text
		}); 

		return $(tpl); 
	}; 
	that.init = init; 
	that.render = render; 

	return that; 
}; 