(function ($) {

AjaxSolr.DurationWidget = AjaxSolr.AbstractFacetWidget.extend({
  init: function () {
    $(document).on('change', '#durationSelect', {'self': this}, this.onSelectionChange);
  },

  onSelectionChange: function(event) {
    var self = event.data.self;
    var timeToWork = event.currentTarget.value_; 
    var startValue, endValue;
    if(timeToWork == 0) {
        startValue = "*";
        endValue = "*";
      }
      if(timeToWork > 0 && timeToWork <= 15) {
        startValue = "1";
        endValue = "15";
      }
      if(timeToWork > 15 && timeToWork <= 30) {
        startValue = "16";
        endValue = "30";
      }
      if(timeToWork > 30 && timeToWork <= 45) {
        startValue = "31";
        endValue = "45";
      }
      if(timeToWork > 45 && timeToWork <= 60) {
        startValue = "46";
        endValue = "60";
      }
      if(timeToWork > 60) {
        startValue = "60";
        endValue = "*";
      }

    if (startValue && endValue && self.set('[' + startValue + ' TO ' + endValue + ']')) {
        self.doRequest(0, 'recipeCollection/select');
    }
  }
});

})(jQuery);