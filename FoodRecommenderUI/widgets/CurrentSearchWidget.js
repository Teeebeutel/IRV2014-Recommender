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
        return false;
      }));
    }
    var fq = this.manager.store.values('fq');
    for (var i = 0, l = fq.length; i < l; i++) {
        var text;
        console.log(fq[i]); 
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
        } else if(description == "timetowork") {
          text = "Dauer: " + value; 
        } else if(value == "true" || value == "false") {
          text = description;
        } else {
          if(description.match(/![A-Za-z]+/)){
            text = 'Ohne '+value;
          }else{
            text = value;
          }
        }
        links.push($('<a href="#"></a>').text('(x) ' + text).click(self.removeFacet(fq[i])));
    
    }

    if (links.length > 1) {
      links.unshift($('<a href="#"></a>').text('remove all').click(function () {
        self.removeAllSelections(self); 
        self.manager.store.remove('fq');
        self.manager.store.get('q').val('*:*');
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

  removeAllSelections: function(self) {
    self.removeNutritionConceptSelection(); 
    self.removeDurationSelection(); 
    self.removeLevelOfDifficultySelection(); 
    self.removeKindOfMenuSelection(); 
    self.clearInputs(); 
  }, 

  clearInputs: function() {
    $('#search input').val(''); 
    $('#addField input').val(''); 
  }, 

  removeNutritionConceptSelection: function() {
    $('#nutritionConceptSelect').attr('selected', 0); 
  }, 

  removeDurationSelection: function() {
    $('#durationSelect').val(0);
  }, 

  removeLevelOfDifficultySelection: function() {
    $('#levelOfDifficultySelector').find('.core-selected').attr('class', 'levelOfDifficulty');
    $('#egal').attr('class', 'levelOfDifficulty core-selected'); 
  }, 

  removeKindOfMenuSelection: function() {
    $('#kindOfMenuSelector').find('.core-selected').attr('class', 'kindOfMenuContainer').find('.selectionMark').remove();
  }, 

  removeSelection: function(description, self) {
    if(description == "type") {
      self.removeKindOfMenuSelection(); 
    } else if(description == "vegetarian" || description == "vegan" || description == "antialc") {
      self.removeNutritionConceptSelection(); 
    } else if(description == "timetowork") {
      self.removeDurationSelection(); 
    } else if(description == "requiredSkill") {
      self.removeLevelOfDifficultySelection(); 
    }
  }, 

  removeFacet: function (facet) {
    var self = this;
    return function () { 
      if (self.manager.store.removeByValue('fq', facet)) {
        self.doRequest(0, 'recipeCollection/select');
        var description = facet.split(":")[0];
        self.removeSelection(description, self); 
      }
      return false;
    };
  }
});

})(jQuery);

}));
