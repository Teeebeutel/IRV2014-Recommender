(function ($) {

AjaxSolr.LevelOfDifficultyWidget = AjaxSolr.AbstractFacetWidget.extend({
  init: function () {
    $(document).on('click', '.levelOfDifficulty', {'self': this}, this.onSelectedItemChange);
  },

  onSelectedItemChange: function(event) {
    var self = event.data.self; 
    var text = $(event.currentTarget).attr('id');
    var value; 
    switch(text) {
      case "leicht":
        value = "25"; 
        break; 
      case "mittel": 
        value = "50"; 
        break; 
      case "schwer": 
        value = "75"; 
        break; 
      default:
        self.clear();
        self.doRequest(0, 'recipeCollection/select');
        break;
    }
    if (value && self.set(value)) {
        self.doRequest(0, 'recipeCollection/select');
    } 
  }
});

})(jQuery);