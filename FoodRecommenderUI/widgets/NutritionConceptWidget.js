(function ($) {

AjaxSolr.NutritionConceptWidget = AjaxSolr.AbstractFacetWidget.extend({
  init: function () {
    var self = this;
    $(document).on('click', '#' + self.field, {'self': self}, this.onNutritionConceptSelectChange);
  }, 

  onNutritionConceptSelectChange: function(event) {
    var self = event.data.self; 
    console.log("nutritionchange");
    var currentlySelectedOption = $(event.currentTarget).attr("id");
    console.log(currentlySelectedOption);
    if (currentlySelectedOption == self.field && self.set("true")) {
        self.doRequest(0, 'recipeCollection/select');
      }
  }
});

})(jQuery);