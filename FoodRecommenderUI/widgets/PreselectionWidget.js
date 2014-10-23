(function ($) {

AjaxSolr.PreselectionWidget = AjaxSolr.AbstractFacetWidget.extend({
  init: function () {
    var self = this;
    console.log(this);
    this.doRequest(0, 'recipeCollection/select');
  }, 

  onNutritionConceptSelectChange: function(event) {
    var self = event.data.self; 
    var currentlySelectedOption = $(event.currentTarget).attr("id");
    if (currentlySelectedOption == self.field && self.set("true")) {
        self.doRequest(0, 'recipeCollection/select');
      }
  }
});

})(jQuery);