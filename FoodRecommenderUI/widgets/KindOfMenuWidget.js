(function ($) {

AjaxSolr.KindOfMenuWidget = AjaxSolr.AbstractFacetWidget.extend({
  afterRequest: function () {
    var self = this;

    $(document).on('click', '.kindOfMenuContainer', {'self': self}, this.onSelectedItemChange);
  },

  onSelectedItemChange: function(event) {
    var self = event.data.self; 
    $('#kindOfMenuSelector').find('.core-selected').find('.selectionMark').remove();
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
        self.doRequest();
      }
  }
});

})(jQuery);