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
    derp = $(this.target);
    console.log(derp);
    $(this.target).empty();
    for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
      var doc = this.manager.response.response.docs[i];
      $(this.target).append(this.template(doc));
      var items = [];
      //console.log('result after request',doc)
      items = items.concat(this.facetLinks('TimeToWork', doc.TimeToWork));
      items = items.concat(this.facetLinks('RequiredSkill', doc.RequiredSkill));
      items = items.concat(this.facetLinks('Vegetarian', doc.Vegetarian));
      items = items.concat(this.facetLinks('Vegan', doc.Vegan));
      items = items.concat(this.facetLinks('UserRating', doc.UserRating));

      var $links = $('#links_' + doc.id);
      $links.empty();
      for (var j = 0, m = items.length; j < m; j++) {
        $links.append($('<li></li>').append(items[j]));
      }
    }
  },

  template: function (doc) {
    //console.log('resultwidget template',doc);
    var snippet = '';
    if (doc.Instructions.length > 300) {
      snippet += /*doc.dateline + ' ' + */doc.Instructions.substring(0, 300);
      snippet += '<span style="display:none;">' + doc.Instructions.substring(300);
      snippet += '</span> <a href="#" class="more">more</a>';
    }
    else {
      snippet += /*doc.dateline + ' ' +*/ doc.Instructions;
    }

    var output = '<div class="resultElement"><div class="resultImg"><img src="./res/images/Plätzchen.jpg"></div><div class="resultDescription"><h2>' + doc.title + '</h2>';
    output += '<p id="links_' + doc.id + '" class="links"></p>';
    output += '<p>' + snippet + '</p></div><paper-icon-button icon="star" class="addToFavouritesBtn"></paper-icon-button><paper-shadow z="1"></paper-shadow></div>';
    return output;
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
