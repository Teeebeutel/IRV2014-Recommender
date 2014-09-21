var self; 

(function ($) {

AjaxSolr.NutritionConceptWidget = AjaxSolr.AbstractFacetWidget.extend({
  afterRequest: function () {
    self = this;
    console.log(self);

    $('#nutritionConceptSelect').on('click', 'core-item', this.onNutritionConceptSelectChange); 

  },

  onNutritionConceptSelectChange: function(event) {
    var target = this;
    var currentlySelectedOption = $(event.currentTarget).attr("label"); 
    console.log(currentlySelectedOption);
    var value;
    console.log(self.field);
    var result; 
    switch(currentlySelectedOption) {
      case "vegetarisch":
        value = "vegetarian"; 
        break; 
      case "vegan": 
        value = "vegan";
        break; 
      case "alkoholfrei": 
        value = "antialc";
        break; 
    }
    if (value == self.field && self.set("true")) {
        self.doRequest(0, 'recipeCollection/select');
      }
  }
});

})(jQuery);