var ingredientsLikesArray = [];
var facetItemId; 
var ProfilView; 
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
    ProfilView.init();
    self = this;
    if(self.id == 'ingredientsLikes') {
      input = $('#likeAddInput'); 
    } else if(self.id == 'ingredientsDislikes') {
      input = $('#dislikeAddInput'); 
    }
       
    input.find('.addButton').on('click', function(e) {
        var value = input.find('input').val();
        ProfilView.addIngredient(value, self.target, self.id);
    });

    facetItemId = 0; 
  }, 

  afterRequest: function () {
    var self = this;

    //Quelle: http://stackoverflow.com/questions/4665466/using-an-if-statement-to-check-if-a-div-is-empty
    /*if( !$.trim( $(self.target).html() ).length ) {
      console.log("trim");
      var saved = self.saved;  
      for(var i = 0; i < saved.length; i++) {
        self.addFacetItem(saved[i], self); 
        ingredientsLikesArray.push(saved[i]);
      }
    }*/

    var fq = this.manager.store.values('fq');
    var fqLength = (fq.length); 
    if(fqLength > 0) {
      var array = fq[fqLength-1].split(":");
      var value = array[1];
      ProfilView.addIngredient(value, self.target, self.id);
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
        ProfilView.addIngredient(value, self.target, self.id);
      }
    });

  }
});

})(jQuery);

}));
