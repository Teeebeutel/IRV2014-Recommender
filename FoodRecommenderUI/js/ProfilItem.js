ProfilItem = function() {
	var that  = {}, 
	template  = null, 
	id = null, 
	username = null, 

	init = function(options) {
		console.log("hi");
		id = options.id; 
		username = options.username; 

		template = $('#profil-tpl').html(); 

		return that; 
	}, 

	render = function() {
		var tpl = _.template(template, {
			id: id, 
			username: username
		}); 

		return $(tpl); 
	}; 
	that.init = init; 
	that.render = render; 

	return that; 
}; 