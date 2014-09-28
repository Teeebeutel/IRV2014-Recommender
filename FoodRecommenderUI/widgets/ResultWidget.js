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

      this.addRecipeItem(id, recipeId, title, instructions, timeToWork, vegetarian, vegan, antialc, '#docs', "./res/images/ajax-loader.gif");
      $('.resultImg img').each(function() {
          recipeId = $(this).closest('.resultElement').attr('data_id'); 
          var img = $(this);
          var url = "http://www.chefkoch.de/rezepte/" + recipeId;
          resultContainer.getImage(url, img);
      }); 
      var items = [];
      items = items.concat(this.facetLinks('ingredientname', doc.ingredientname));

      var $links = $('#links_' + id);
      $links.empty();
      for (var j = 0, m = items.length; j < m; j++) {
        $links.append($('<li></li>').append(items[j]));
      }
    }
  },

  getTimeToWorkImg: function(timeToWork) {
    var timeToWorkImg = ""; 

    if (timeToWork != undefined) {
      if(timeToWork == 0) {
        timeToWorkImg = '<img src="./res/images/0min.png">'; 
      }
      if(timeToWork > 0 && timeToWork <= 15) {
        timeToWorkImg = '<img src="./res/images/15min.png">'; 
      }
      if(timeToWork > 15 && timeToWork <= 30) {
        timeToWorkImg = '<img src="./res/images/30min.png">'; 
      }
      if(timeToWork > 30 && timeToWork <= 45) {
        timeToWorkImg = '<img src="./res/images/45min.png">'; 
      }
      if(timeToWork > 45 && timeToWork <= 60) {
        timeToWorkImg = '<img src="./res/images/60min.png">'; 
      }
      if(timeToWork > 60) {
        timeToWorkImg = '<img src="./res/images/+60min.png">'; 
      }
    }
    return timeToWorkImg; 
  }, 

  addRecipeItem: function(id, recipeId, title, instructions, timeToWork, vegetarian, vegan, antialc, container, imgSrc) {
    
    var thisVegetarian = vegetarian; 
    var thisVegan = vegan; 
    var thisAntialc = antialc; 
    var timeToWorkImg = this.getTimeToWorkImg(timeToWork);
    resultId++;
    var snippet = '';
    if (instructions.length > 200) {
      snippet += instructions.substring(0, 200);
      snippet += '<span style="display:none;">' + instructions.substring(200);
      snippet += '</span> <a href="#" class="more">more</a>';
    }
    else {
      snippet += instructions;
    }

    
    if(jQuery.isNumeric(vegetarian)) {
      thisVegetarian = this.numberToBoolean(vegetarian);
      thisVegan = this.numberToBoolean(vegan);
      thisAntialc = this.numberToBoolean(antialc);
    }
    var images = ""; 
    images += thisVegetarian ? '<img src="./res/images/vegetarisch.png">' : ''; 
    images += thisVegan ? '<img src="./res/images/vegan.png">' : ''; 
    images += thisAntialc ? '<img src="./res/images/alkoholfrei.png">' : ''; 
    images += timeToWorkImg;

      this.makeRecipeItem({
        resultId: "resultElement" + resultId, 
        recipeId: recipeId,
        title: title,
        id: id,
        snippet: snippet, 
        images: images, 
        container: container, 
        imgSrc: imgSrc
      });
      var thisTimeToWork = (timeToWork == undefined ? -1 : timeToWork);
      $(document).on('click', '#resultElement' + resultId + ' .addToFavouritesBtn', {'id': id, 'recipeId': recipeId, 'title': title, 'instructions': instructions, 'timeToWork': thisTimeToWork, 'vegetarian': this.booleanToNumber(thisVegetarian), 'vegan': this.booleanToNumber(thisVegan), 'antialc': this.booleanToNumber(thisAntialc)}, this.onAddToFavouritesBtnClick);
  },  

  makeRecipeItem: function(options) {
      var item = RecipeItem().init({
        resultId: options.resultId, 
        recipeId: options.recipeId,
        title: options.title,
        id: options.id,
        snippet: options.snippet, 
        images: options.images, 
        imgSrc: options.imgSrc
      });
      var $el = item.render(); 
      $(options.container).append($el);
  }, 

  booleanToNumber: function(boolean) {
    return (boolean == false ? 0 : 1);
  }, 

  numberToBoolean: function(number) {
    return (number == 0 ? false : true);
  }, 

  onAddToFavouritesBtnClick: function(event) {
    var id = event.data.id;
    var recipeId = event.data.recipeId; 
    var title = event.data.title[0]; 
    var instructions = event.data.instructions; 
    var timeToWork = event.data.timeToWork; 
    var vegetarian  = event.data.vegetarian; 
    var vegan = event.data.vegan; 
    var antialc = event.data.antialc; 
    var imgSrc = $(event.currentTarget).closest('.resultElement').find('img').attr('src');
    var data = {id: id, recipeId: recipeId, title: title, instructions: instructions, timeToWork: timeToWork, vegetarian: vegetarian, vegan: vegan, antialc: antialc, imgSrc: imgSrc};
    $(event.currentTarget).css('color', '#ffc107')
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
