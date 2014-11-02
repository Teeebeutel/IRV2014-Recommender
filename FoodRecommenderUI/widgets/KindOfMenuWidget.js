(function ($) {

AjaxSolr.KindOfMenuWidget = AjaxSolr.AbstractFacetWidget.extend({
   
  init: function () {
    $(document).on('click', '.kindOfMenuContainer', {'self': this}, this.onSelectedItemChange);
  },

  onSelectedItemChange: function(event) {
    var self = event.data.self; 
    var coreSelected = $('#kindOfMenuSelector').find('.core-selected'); 
    coreSelected.find('.selectionMark').remove();
    if($(coreSelected).attr('id') == $(event.currentTarget).attr('id')) {
      $(event.currentTarget).attr('class', 'kindOfMenuContainer'); 
      self.clear(); 
      self.doRequest(0, 'recipeCollection/select');

    } else if($(coreSelected).attr('id') != $(event.currentTarget).attr('id')) {
      $(event.currentTarget).attr('class', 'kindOfMenuContainer core-selected'); 
      $(event.currentTarget).append('<div class="selectionMark"><div class="iconDiv"></div><core-icon icon="check"></core-icon></div>');
      var text = $(event.currentTarget).find('div').text();
      var value; 
      switch(text) {
        case "Mittagessen":
          value = "mainmeal"; 
          break; 
        case "Frühstück": 
          value = "breakfast"; 
          break; 
      }
      if (value && self.set(value)) {
        self.doRequest(0, 'recipeCollection/select');
      }
    }
    
  }
});

})(jQuery);