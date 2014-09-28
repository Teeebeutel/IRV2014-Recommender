AdvancedSearchItem = function() {
	var that  = {}, 
	template  = null, 
	id = null, 
	kindOfMenuNr = null, 
	nutritionConceptNr = null, 
	durationValue = null, 
	levelOfDifficultyNr = null, 

	init = function(options) {
		id = options.id; 
		kindOfMenuNr = options.kindOfMenuNr; 
		nutritionConceptNr = options.nutritionConceptNr; 
		durationValue = options.durationValue;
		levelOfDifficultyNr = options.levelOfDifficultyNr;

		template = $('#advancedSearch-tpl').html(); 

		return that; 
	}, 

	render = function() {
		var tpl = _.template(template, {
			id: id, 
			kindOfMenuNr: kindOfMenuNr, 
			nutritionConceptNr: nutritionConceptNr, 
			durationValue: durationValue, 
			levelOfDifficultyNr: levelOfDifficultyNr
		}); 

		return $(tpl); 
	}; 
	that.init = init; 
	that.render = render; 

	return that; 
}; 