(function (callback) {
  if (typeof define === 'function' && define.amd) {
    define(['core/AbstractTextWidget'], callback);
  }
  else {
    callback();
  }
}(function () {

(function ($) {

AjaxSolr.AutocompleteWidget = AjaxSolr.AbstractTextWidget.extend({



  addAdvancedSearchItem: function() {
      makeAdvancedSearchItem({
        id: "advancedSearchItem"
      });
      Manager.doRequest(0, 'recipeCollection/select');
      $(document).on('click', '#countSelect core-item', onCountSelectChange);
  },

  onCountSelectChange: function(event) {
    var value = $(event.currentTarget).attr('label');
    Manager.store.addByValue('rows', value);
    Manager.doRequest(0, 'recipeCollection/select');
  },

  makeAdvancedSearchItem: function(options) {
      var item = AdvancedSearchItem().init({
        id: options.id
      });
      var $el = item.render(); 
      $('#content').append($el);
  },

  emptyContent: function() {
    $('#content').empty();
  },




  onSearchButtonClick:  function(event) {
      var value = $('#query').val();
      var self = event.data.self;
      console.log(value);
      self.manager.store.get('q').val('*:*');
      self.manager.store.remove('fq');
      if (value && self.set(value)) {
        self.emptyContent();
        self.addAdvancedSearchItem();
        self.doRequest(0, 'recipeCollection/select');
        $('#levelOfDifficultySelector').prop('selected', 0);
        $('#nutritionConceptSelect').prop('selected', 0);
      }
  }, 

  init: function() {
    $('#searchButton').on('click', {'self': this}, this.onSearchButtonClick); 
  }, 
  
  afterRequest: function () {
    $(this.target).find('input').unbind().removeData('events');
    
    var self = this;
      var callback = function (response) {
      var list = [];
      for (var i = 0; i < self.fields.length; i++) {
        var field = self.fields[i];
        for (var facet in response.facet_counts.facet_fields[field]) {
          list.push({
            field: field,
            value: facet,
            label: facet
            //label: facet + ' (' + response.facet_counts.facet_fields[field][facet] + ') - ' + field
          });
        }
      }

      self.requestSent = false;
      $(self.target).find('input').autocomplete('destroy').autocomplete({
        source: list,
        select: function(event, ui) {
          if (ui.item) {
            console.log(self.id);
            self.requestSent = true;
            if(self.id == "text") {
              self.manager.store.get('q').val('*:*');
              self.manager.store.remove('fq');
              if (self.manager.store.addByValue('fq', ui.item.field + ':' + AjaxSolr.Parameter.escapeValue(ui.item.value))) {
                self.emptyContent();
                self.addAdvancedSearchItem();
                self.doRequest(0, 'recipeCollection/select');
                $('#levelOfDifficultySelector').prop('selected', 0);
                $('#nutritionConceptSelect').prop('selected', 0);
              }
            } else {
              if (self.manager.store.addByValue('fq', ui.item.field + ':' + AjaxSolr.Parameter.escapeValue(ui.item.value))) {
                self.doRequest(0, 'recipeCollection/select');
              }
            }
          }
        }
      });
      
      $(self.target).find('input').on('click', function() {
          var input = $(self.target).find('input'); 
          input.focus(); 
          input.select(); 

      });

      // This has lower priority so that requestSent is set.
      $(self.target).find('input').bind('keydown', function(e) {
        if (self.requestSent === false && e.which == 13) {
          var value = $(this).val();
          if(self.id == "text") {
            self.manager.store.get('q').val('*:*');
            self.manager.store.remove('fq');
            if (value && self.set(value)) {
              self.emptyContent();
              self.addAdvancedSearchItem();
              self.doRequest(0, 'recipeCollection/select');
              $('#levelOfDifficultySelector').prop('selected', 0);
              $('#nutritionConceptSelect').prop('selected', 0);
            }
          } else {
            if (value && self.set(value)) {
              self.doRequest(0, 'recipeCollection/select');
            }
          }
        }
      });
    } // end callback

    var params = [ 'rows=0&facet=true&facet.limit=300&facet.mincount=1&json.nl=map' ];
    for (var i = 0; i < this.fields.length; i++) {
      params.push('facet.field=' + this.fields[i]);
    }
    var values = this.manager.store.values('fq');
    for (var i = 0; i < values.length; i++) {
      params.push('fq=' + encodeURIComponent(values[i]));
    }
    params.push('q=' + this.manager.store.get('q').val());
    $.getJSON(this.manager.solrUrl + 'recipeCollection/select?' + params.join('&') + '&wt=json&json.wrf=?', {}, callback);
  }
});

})(jQuery);

}));
