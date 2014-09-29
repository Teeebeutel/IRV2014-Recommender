(function (callback) {
  if (typeof define === 'function' && define.amd) {
    define(['core/AbstractWidget'], callback);
  }
  else {
    callback();
  }
}(function () {

(function ($) {

AjaxSolr.CurrentSearchWidget = AjaxSolr.AbstractWidget.extend({
  start: 0,

  afterRequest: function () {
    var self = this;
    var links = [];

    var q = this.manager.store.get('q').val();
    if (q != '*:*') {
      links.push($('<a href="#"></a>').text('(x) ' + q).click(function () {
        self.manager.store.get('q').val('*:*');
        self.doRequest(0, 'recipeCollection/select');
        return false;
      }));
    }

    var fq = this.manager.store.values('fq');
    console.log(fq);
    for (var i = 0, l = fq.length; i < l; i++) {
        var text;
        var array = fq[i].split(":");
        var value = array[1];
        var description = array[0];
        if(value == "breakfast") {
          text = "Frühstück";
        } else if(value == "mainmeal") {
          text = "Mittagessen";
        } else if(fq[i] == "requiredSkill:25") {
          text = "leicht";
        } else if(fq[i] == "requiredSkill:50") {
          text = "mittel";
        } else if(fq[i] == "requiredSkill:75") {
          text = "schwer";
        } else if(description == "vegetarian") {
          text = "vegetarisch";
        } else if(description == "antialc") {
          text = "alkoholfrei"; 
        } else if(value == "true" || value == "false") {
          text = fq[i].split(":")[0];
        } else {
          text = value;
        }
        links.push($('<a href="#"></a>').text('(x) ' + text/*fq[i]*/).click(self.removeFacet(fq[i])));
     // }
    }

    if (links.length > 1) {
      links.unshift($('<a href="#"></a>').text('remove all').click(function () {
        self.manager.store.get('q').val('*:*');
        self.manager.store.remove('fq');
        self.doRequest(0, 'recipeCollection/select');
        return false;
      }));
    }

    if (links.length) {
      var $target = $(this.target);
      $target.empty();
      for (var i = 0, l = links.length; i < l; i++) {
        $target.append($('<li></li>').append(links[i]));
      }
    }
    else {
      $(this.target).html('<li>Viewing all documents!</li>');
    }
  },

  removeFacet: function (facet) {
    var self = this;
    return function () {
      if (self.manager.store.removeByValue('fq', facet)) {
        self.doRequest(0, 'recipeCollection/select');
      }
      return false;
    };
  }
});

})(jQuery);

}));
