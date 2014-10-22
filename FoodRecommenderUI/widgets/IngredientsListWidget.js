var ingredientsLikesArray = [];
var facetItemId; 
var self; 
(function (callback) {
  if (typeof define === 'function' && define.amd) {
    define(['core/AbstractWidget'], callback);
  }
  else {
    callback();
  }
}(function () {

(function ($) {

AjaxSolr.IngredientsListWidget = AjaxSolr.AbstractWidget.extend({
  start: 0,

  init: function() {
    var input; 
    self = this;
    if(self.id == 'ingredientsLikes') {
      input = $('#likeAddInput'); 
    } else if(self.id == 'ingredientsDislikes') {
      input = $('#dislikeAddInput'); 
    }
       
    input.find('.addButton').on('click', function(e) {
        var value = input.find('input').val();
        self.addIngredient(value, self);
    });


    facetItemId = 0; 
  }, 

  onIngredientItemEnter: function(event) {
      $(event.currentTarget).find(".deleteButton").show(); 
  }, 

  onIngredientItemLeave: function(event) {
      $(event.currentTarget).find(".deleteButton").hide(); 
  },

  onDeleteButtonClick: function(event) {
    var self = event.data.self; 
    var facetItem = $(event.currentTarget).closest(".facetItem");
    var value = facetItem.find('.ingredientName').text();
    ingredientsLikesArray = self.deleteFromArray(ingredientsLikesArray, value);
    facetItem.remove(); 
    console.log(self.id);
    var data = {value: value, kind: self.id};
    $.get("php/functions.php?command=deleteIngredient", data); 
  }, 

  addIngredient: function(value, self) {
    if(ingredientsLikesArray.length == 0 || !(ingredientsLikesArray.indexOf(value) > -1)) {
        self.addFacetItem(value, self); 
        ingredientsLikesArray.push(value);
        var data = {value: value, kind: self.id};
        console.log(self.id);
        $.get("php/functions.php?command=saveIngredient", data); 
    }
  }, 

  deleteFromArray: function(array, value) {
    for(var i in array) {
      if(array[i] == value) {
        array.splice(i,1);
        break; 
      }
    }
    return array;
  }, 

  addFacetItem: function(value, self) {
      self.makeFacetItem({
        id: "facetItem" + facetItemId, 
        title: value, 
        self: self
      });
      $("#facetItem" + facetItemId).on("mouseenter", self.onIngredientItemEnter);
      $("#facetItem" + facetItemId).on("mouseleave", self.onIngredientItemLeave);
      $("#facetItem" + facetItemId).on("click", ".deleteButton", {self: self}, self.onDeleteButtonClick); 
      facetItemId++; 
  }, 

  makeFacetItem: function(options) {
      var item = FacetItem().init({
        id: options.id, 
        title: options.title
      });
      var $el = item.render(); 
      $(options.self.target).append($el);
  },

  afterRequest: function () {
    var self = this;

    //Quelle: http://stackoverflow.com/questions/4665466/using-an-if-statement-to-check-if-a-div-is-empty
    if( !$.trim( $(self.target).html() ).length ) {
      console.log("trim");
      var saved = self.saved;  
      for(var i = 0; i < saved.length; i++) {
        self.addFacetItem(saved[i], self); 
        ingredientsLikesArray.push(saved[i]);
      }
    }

    var fq = this.manager.store.values('fq');
    var fqLength = (fq.length); 
    if(fqLength > 0) {
      var array = fq[fqLength-1].split(":");
      var value = array[1];
      self.addIngredient(value, self);
    }
    
    var input; 
    if(self.id == 'ingredientsLikes') {
      input = $('#likeAddInput'); 
    } else if(self.id == 'ingredientsDislikes') {
      input = $('#dislikeAddInput'); 
    }
    
    input.find('input').bind('keydown', function(e) {
      if (e.which == 13) {
        var value = input.find('input').val();
        self.addIngredient(value, self);
      }
    });

  }
});

})(jQuery);

}));
