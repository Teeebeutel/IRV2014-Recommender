ProfilView = (function() {
  var that = {}, 
  ingredientsArray = [],
  ingredientsLikesArray = [],
  ingredientsDislikesArray = [],

  init = function() {
    return that; 
  }, 
  
  onIngredientItemEnter =  function(event) {
      $(event.currentTarget).find(".deleteButton").show(); 
  }, 

  onIngredientItemLeave =  function(event) {
      $(event.currentTarget).find(".deleteButton").hide(); 
  },

  onDeleteButtonClick =  function(event) {
    var id = event.data.id; 
    var facetItem = $(event.currentTarget).closest(".facetItem");
    var value = facetItem.find('.ingredientName').text();
    ingredientsArray = deleteFromArray(ingredientsArray, value);
    if(id == 'ingredientsLikes') {
      ingredientsLikesArray = deleteFromArray(ingredientsLikesArray, value);
    } else if(id == 'ingredientsDislikes') {
      ingredientsDislikesArray = deleteFromArray(ingredientsDislikesArray, value);
    }
    facetItem.remove(); 
    var data = {value: value, kind: id};
    $.get("php/functions.php?command=deleteIngredient", data); 
  }, 

  emptyIngredientsArray = function() {
    ingredientsArray = []; 
    ingredinetsLikesArray = []; 
    ingredientsDislikesArray = []; 
  }, 

  addIngredient = function(value, target, id) {
    if(ingredientsArray.length == 0 || !(ingredientsArray.indexOf(value) > -1)) {
        addFacetItem(value, target, id); 
        ingredientsArray.push(value);
        if(id == 'ingredientsLikes') {
          ingredientsLikesArray.push(value); 
        } else if(id == 'ingredientsDislikes') {
          ingredientsDislikesArray.push(value); 
        }
        var data = {value: value, kind: id};
        $.get("php/functions.php?command=saveIngredient", data); 
    }
  }, 

  deleteFromArray = function(array, value) {
    for(var i in array) {
      if(array[i] == value) {
        array.splice(i,1);
        break; 
      }
    }
    return array;
  },

  addFacetItem = function(value, target, id) {
      makeFacetItem({
        id: "facetItem" + facetItemId, 
        title: value, 
        target: target
      });
      $("#facetItem" + facetItemId).on("mouseenter", onIngredientItemEnter);
      $("#facetItem" + facetItemId).on("mouseleave", onIngredientItemLeave);
      $("#facetItem" + facetItemId).on("click", ".deleteButton", {id: id}, onDeleteButtonClick); 
      facetItemId++; 
  }, 

  makeFacetItem = function(options) {
      var item = FacetItem().init({
        id: options.id, 
        title: options.title
      });
      var $el = item.render(); 
      $(options.target).append($el);
  }, 

  getLikes = function() {
    return ingredientsLikesArray; 
  }, 

  getDislikes = function() {
    return ingredientsDislikesArray; 
  }, 

  setIngredients = function(likes, dislikes) {
    ingredientsLikesArray = likes; 
    ingredientsDislikesArray = dislikes; 
  };

  that.init = init; 
  that.addIngredient = addIngredient; 
  that.emptyIngredientsArray = emptyIngredientsArray; 
  that.getLikes = getLikes; 
  that.getDislikes = getDislikes; 
  that.setIngredients = setIngredients; 

  return that; 

})(); 