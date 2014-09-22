(function ($) {

AjaxSolr.DurationWidget = AjaxSolr.AbstractFacetWidget.extend({
  init: function () {
    $(document).on('change', '#durationSelect', {'self': this}, this.onSelectionChange);
  },

  onSelectionChange: function(event) {
    console.log(event.currentTarget.value_);
    var self = event.data.self;
    //var timeToWork = parseInt(event.currentTarget.value_);
    var value = event.currentTarget.value_; 
    /*if(timeToWork == 0) {
        value = "0";
      }
      if(timeToWork > 0 && timeToWork <= 15) {
        console.log("15");
        value = "1 TO 15";
      }
      if(timeToWork > 15 && timeToWork <= 30) {
        value = "16 TO 30";
      }
      if(timeToWork > 30 && timeToWork <= 45) {
        value = "31 TO 45";
      }
      if(timeToWork > 45 && timeToWork <= 60) {
        value = "45 TO 60";
      }
      if(timeToWork > 60) {
        value = "61 TO *";
      }
*/
    if (value && self.set(value.toString())) {
        self.doRequest(0, 'recipeCollection/select');
    }
    /*var self = event.data.self; 
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
    } */
  }
});

})(jQuery);