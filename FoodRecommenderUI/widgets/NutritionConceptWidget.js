(function ($) {

AjaxSolr.NutritionConceptWidget = AjaxSolr.AbstractFacetWidget.extend({
  afterRequest: function () {
    var self = this;

    $(document).on('core-select', '#nutritionConceptSelect', this.onNutritionConceptSelectChange); 
  },

  onNutritionConceptSelectChange: function(event) {
    var target = this;
    var currentlySelectedOption = $(event.currentTarget.selectedItem).attr("label"); 
    console.log(currentlySelectedOption);
  }
});

})(jQuery);