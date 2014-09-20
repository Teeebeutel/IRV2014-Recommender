(function ($) {

AjaxSolr.NutritionConceptWidget = AjaxSolr.AbstractFacetWidget.extend({
  afterRequest: function () {
    var self = this;

    //$(document).on('core-select', '#nutritionConceptSelect', this.onNutritionConceptSelectChange); 

    $(document).on('click', '#nutritionConceptSelect core-item', this.onNutritionConceptSelectChange); 

  },

  onNutritionConceptSelectChange: function(event) {
    console.log(event);
    var target = this;
    //var currentlySelectedOption = $(event.currentTarget.selectedItem).attr("label"); 
    var currentlySelectedOption = $(event.currentTarget).attr("label"); 
    console.log(currentlySelectedOption);
  }
});

})(jQuery);