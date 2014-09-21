(function ($) {

AjaxSolr.NutritionConceptWidget = AjaxSolr.AbstractFacetWidget.extend({
  afterRequest: function () {
    self = this;
    field = self.field;

    $('#' + self.field).on('click', {'self': self}, this.onNutritionConceptSelectChange); 
  },

  onNutritionConceptSelectChange: function(event) {
    var self = event.data.self; 
    //var currentlySelectedOption = $(event.currentTarget).attr("label"); 
    var currentlySelectedOption = $(event.currentTarget).attr("id");
    console.log(currentlySelectedOption);
    if (currentlySelectedOption == self.field && self.set("true")) {
        self.doRequest(0, 'recipeCollection/select');
      }
  }
});

})(jQuery);