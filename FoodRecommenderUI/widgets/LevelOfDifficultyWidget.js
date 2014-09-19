(function ($) {

AjaxSolr.LevelOfDifficultyWidget = AjaxSolr.AbstractFacetWidget.extend({
  afterRequest: function () {
    var self = this;

    $(document).on('click', '.levelOfDifficulty', {'self': self}, this.onSelectedItemChange);
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
        self.doRequest();
        break;
    }
    if (value && self.set(value)) {
        self.doRequest();
    } 
  }
});

})(jQuery);