var resultId = 0; 

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
      this.addRecipeItem(doc);
      $('.resultImg img').each(function() {
          recipeId = $(this).closest('.resultElement').attr('data_id'); 
          var img = $(this);
          var url = "http://www.chefkoch.de/rezepte/" + recipeId;
          resultContainer.getImage(url, img);
      }); 
      var items = [];
      items = items.concat(this.facetLinks('timetowork', doc.timetowork));
      items = items.concat(this.facetLinks('requiredskill', doc.requiredSkill));
      items = items.concat(this.facetLinks('vegetarian', doc.vegetarian));
      items = items.concat(this.facetLinks('vegan', doc.vegan));
      //items = items.concat(this.facetLinks('userrating', doc.UserRating));

      var $links = $('#links_' + doc.id);
      $links.empty();
      for (var j = 0, m = items.length; j < m; j++) {
        $links.append($('<li></li>').append(items[j]));
      }
    }
  },

  addRecipeItem: function(doc) {
    resultId++;
    var snippet = '';
    var recipeId = doc.recipe_id; 
    var title = doc.title; 
    var id = doc.id; 
    var instructions = doc.instructions; 
    var timeToWork = doc.timetowork;
    var vegetarian = doc.vegetarian; 
    var vegan = doc.vegan; 
    var antialc = doc.antialc; 
    if (instructions.length > 200) {
      snippet += instructions.substring(0, 200);
      snippet += '<span style="display:none;">' + instructions.substring(200);
      snippet += '</span> <a href="#" class="more">more</a>';
    }
    else {
      snippet += doc.instructions;
    }

    var images = ""; 
    images += vegetarian ? '<img src="./res/images/vegetarisch.png">' : ''; 
    images += vegan ? '<img src="./res/images/vegan.png">' : ''; 
    images += antialc ? '<img src="./res/images/alkoholfrei.png">' : ''; 

      this.makeRecipeItem({
        resultId: "resultElement" + resultId, 
        recipeId: recipeId,
        title: title,
        id: id,
        snippet: snippet, 
        images: images
      });
      $(document).on('click', '#resultElement' + resultId + ' .addToFavouritesBtn', {'recipeId': recipeId, 'title': title, 'instructions': instructions, 'timeToWork': timeToWork, 'vegetarian': this.booleanToNumber(vegetarian), 'vegan': this.booleanToNumber(vegan), 'antialc': this.booleanToNumber(antialc)}, this.onAddToFavouritesBtnClick);
  },  

  makeRecipeItem: function(options) {
      var item = RecipeItem().init({
        resultId: options.resultId, 
        recipeId: options.recipeId,
        title: options.title,
        id: options.id,
        snippet: options.snippet, 
        images: options.images
      });
      var $el = item.render(); 
      $('#docs').append($el);
  }, 

  booleanToNumber: function(boolean) {
    return (boolean == false ? 0 : 1);
  }, 

  onAddToFavouritesBtnClick: function(event) {
    var recipeId = event.data.recipeId; 
    var title = event.data.title[0]; 
    var instructions = event.data.instructions; 
    var timeToWork = event.data.timeToWork; 
    var vegetarian  = event.data.vegetarian; 
    var vegan = event.data.vegan; 
    var antialc = event.data.antialc; 

    var data = {recipeId: recipeId, title: title, instructions: instructions, timeToWork: timeToWork, vegetarian: vegetarian, vegan: vegan, antialc: antialc};
    $.get("php/functions.php?command=saveRecipe", data); 
  }, 

  getImage: function(url, img) {
    $.get("php/functions.php?command=getImage", {url: url}).done(
    function(data) {
      var json = data; 
      img.attr('src', json);
    });
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
