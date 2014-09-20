(function (callback) {
  if (typeof define === 'function' && define.amd) {
    define(['core/AbstractTextWidget'], callback);
  }
  else {
    callback();
  }
}(function () {

(function ($) {

AjaxSolr.AutocompleteWidget2 = AjaxSolr.AbstractTextWidget.extend({
  afterRequest: function () {
    $(this.target).find('input').unbind().removeData('events');

    var self = this;

    console.log("hi");
    var callback = function (response) {
      var list = [];
      for (var i = 0; i < self.fields.length; i++) {
        var field = self.fields[i];
        console.log(field[0]);
        for (var facet in response.facet_counts.facet_fields[field]) {
          list.push({
            field: field,
            value: facet,
            label: facet + ' (' + response.facet_counts.facet_fields[field][facet] + ') - ' + field
          });
        }
      }

      self.requestSent = false;
      $(self.target).find('input').autocomplete('destroy').autocomplete({
        source: list,
        select: function(event, ui) {
          if (ui.item) {
            self.requestSent = true;
            if (self.manager.store.addByValue('fq', ui.item.field + ':' + AjaxSolr.Parameter.escapeValue(ui.item.value))) {
              self.doRequest(0, 'ingredientsCollection/select');
            }
          }
        }
      });

      // This has lower priority so that requestSent is set.
      $(self.target).find('input').bind('keydown', function(e) {
        if (self.requestSent === false && e.which == 13) {
          var value = $(this).val();
          if (value && self.set(value)) {
            self.doRequest(0, 'ingredientsCollection/select');
          }
        }
      });
    } // end callback

    var params = [ 'rows=0&facet=true&facet.limit=100&facet.mincount=1&json.nl=map' ];
    for (var i = 0; i < this.fields.length; i++) {
      params.push('facet.field=' + this.fields[i]);
    }
    var values = this.manager.store.values('fq');
    for (var i = 0; i < values.length; i++) {
      params.push('fq=' + encodeURIComponent(values[i]));
    }
    params.push('q=' + this.manager.store.get('q').val());
    $.getJSON(this.manager.solrUrl + 'ingredientsCollection/select?' + params.join('&') + '&wt=json&json.wrf=?', {}, callback);
  }
});

})(jQuery);

}));
