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
      self.doRequest();
      return false;
    };
  },

  afterRequest: function () {
    var recipeId;
    var resultContainer = this;
    $(this.target).empty();
    for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
      var doc = this.manager.response.response.docs[i];
      $(this.target).append(this.template(doc));
      $('.resultImg img').each(function() {
          recipeId = $(this).attr('id'); 
          var img = $(this);
          var url = "http://www.chefkoch.de/rezepte/" + recipeId;
          resultContainer.getImage(url, function(result) {
              img.attr('src', result);
          });
      }); 
      var items = [];
      items = items.concat(this.facetLinks('timetowork', doc.TimeToWork));
      items = items.concat(this.facetLinks('requiredskill', doc.RequiredSkill));
      items = items.concat(this.facetLinks('vegetarian', doc.Vegetarian));
      items = items.concat(this.facetLinks('vegan', doc.Vegan));
      items = items.concat(this.facetLinks('userrating', doc.UserRating));

      var $links = $('#links_' + doc.id);
      $links.empty();
      for (var j = 0, m = items.length; j < m; j++) {
        $links.append($('<li></li>').append(items[j]));
      }
    }
  },

  template: function (doc) {
    //console.log(doc);
    //console.log(doc.type/*, doc.vegan, doc.gluten, doc.lactose, doc.vegetarian, doc.antialc*/);
    var snippet = '';
    if (doc.instructions.length > 300) {
      snippet += /*doc.dateline + ' ' + */doc.instructions.substring(0, 300);
      snippet += '<span style="display:none;">' + doc.instructions.substring(300);
      snippet += '</span> <a href="#" class="more">more</a>';
    }
    else {
      snippet += /*doc.dateline + ' ' + */doc.instructions;
    }

    var images = ""; 
    images += doc.vegan ? '<img src="./res/images/vegan.png">' : ''; 
    images += doc.gluten ? '<img src="./res/images/gluthenfrei.png">' : ''; 
    images += doc.lactose ? '<img src="./res/images/laktosefrei.png">' : ''; 
    images += doc.vegetarian ? '<img src="./res/images/vegetarisch.png">' : ''; 
    images += doc.antialc ? '<img src="./res/images/alkoholfrei.png">' : ''; 

    var output = '<div class="resultElement"><div class="resultImg"><img id="' + doc.recipe_id + '" src="./res/images/ajax-loader.gif"></div><div class="resultDescription"><h2>' + doc.title + '</h2>';
    output += '<p id="links_' + doc.id + '" class="links"></p>';
    output += '<p>' + snippet + '</p></div><paper-icon-button icon="star" class="addToFavouritesBtn"></paper-icon-button><div class="iconContainer">'+ images+'</div><paper-shadow z="1"></paper-shadow></div>';
    return output;
  },

  getImage: function(url, callback) {
    var imgUrl = '';
    $.getJSON("http://query.yahooapis.com/v1/public/yql?"+
                "q=select%20*%20from%20html%20where%20url%3D%22"+
                encodeURIComponent(url)+
                "%22&format=xml'&callback=?",
        function(data){
          if(data.results[0]){
            var data = data.results[0];

            var startIndex = data.indexOf('id="slider"'); 
            if(startIndex == -1) {
              imgUrl = "res/images/noImage.png"; 
            } else{
              var endIndex = data.indexOf("</a>", startIndex); 
              var slicedString = data.slice(startIndex, endIndex)
              var beginStr = 'href="'; 
              var endStr = '.jpg'; 
              var imgSrcStart = slicedString.indexOf(beginStr) + beginStr.length;
              var imgSrcEnd = slicedString.indexOf(endStr) + endStr.length; 
              slicedString = slicedString.slice(imgSrcStart, imgSrcEnd); 
              imgUrl = slicedString; 
              
            }
          } else {
            imgUrl = "res/images/noImage.png"; 
          }
          callback(imgUrl);
        }
      );
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
