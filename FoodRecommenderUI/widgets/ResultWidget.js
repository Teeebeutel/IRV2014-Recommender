var resultId = 0; 
var recipeView; 

(function (callback) {
  if (typeof define === 'function' && define.amd) {
    define(['core/AbstractWidget'], callback);
  }
  else {
    callback();
  }
}(function () {

(function ($) {


AjaxSolr.ResultWidget = AjaxSolr.AbstractWidget.extend({
  start: 0,

  beforeRequest: function () {
    $(this.target).html($('<img>').attr('src', 'res/images/ajax-loader.gif'));
  },

  facetLinks: function (facet_field, facet_values) {
    var links = [];
    if (facet_values) {
      for (var i = 0, l = facet_values.length; i < l; i++) {
        if (facet_values[i] !== undefined) {
          links.push(
            $('<a href="#"></a>')
            .text(facet_values[i])
            .click(this.facetHandler(facet_field, facet_values[i]))
          );
        }
        else {
          links.push('no items found in current selection');
        }
      }
    }
    return links;
  },

  facetHandler: function (facet_field, facet_value) {
    var self = this;
    return function () {
      $('#levelOfDifficultySelector').attr('selected', "0");
      self.manager.store.remove('fq');
      self.manager.store.addByValue('fq', facet_field + ':' + AjaxSolr.Parameter.escapeValue(facet_value));
      self.doRequest(0, 'recipeCollection/select');
      return false;
    };
  },

  afterRequest: function () {
    
    var recipeId;
    var resultContainer = this;
    $(this.target).empty();
    for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
      var doc = this.manager.response.response.docs[i];

      var recipeId = doc.recipe_id; 
      var title = doc.title; 
      var id = doc.id; 
      var instructions = doc.instructions; 
      var timeToWork = doc.timetowork;
      var vegetarian = doc.vegetarian; 
      var vegan = doc.vegan; 
      var antialc = doc.antialc;
      
      FoodRecommender.RecipeView.addRecipeItem(id, recipeId, title, instructions, timeToWork, vegetarian, vegan, antialc, '#docs', "./res/images/noImage.png");
      
      var items = [];
      items = items.concat(this.facetLinks('ingredientname', doc.ingredientname));

      var $links = $('#links_' + id);
      $links.empty();
      for (var j = 0, m = items.length; j < m; j++) {
        $links.append($('<li></li>').append(items[j]));
      }
    }
  },

  init: function () {
    $(document).on('click', 'a.more', function () {
      var $this = $(this),
          span = $this.parent().find('span');

      if (span.is(':visible')) {
        span.hide();
        $this.text('more');
      }
      else {
        span.show();
        $this.text('less');
      }

      return false;
    });
  }
});

})(jQuery);

}));
