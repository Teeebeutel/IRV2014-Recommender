FoodRecommender.ProfilView = (function() {
  var that = {}, 
  ingredientsArray = [],
  ingredientsLikesArray = [],
  ingredientsDislikesArray = [],
  LikeManager = null, 
  DislikeManager = null, 

  init = function() {
    return that; 
  }, 
  
  initManagers = function() {
    LikeManager = new AjaxSolr.Manager({
      solrUrl: 'http://localhost:8983/solr/' 
    }); 
    DislikeManager = new AjaxSolr.Manager({
      solrUrl: 'http://localhost:8983/solr/' 
    });

    LikeManager.addWidget(new AjaxSolr.AutocompleteWidget({
        id: 'likeAddInput',
        target: '#likeAddInput',
        fields: ['ingredientname']
      }));
      DislikeManager.addWidget(new AjaxSolr.AutocompleteWidget({
        id: 'dislikeAddInput',
        target: '#dislikeAddInput',
        fields: ['ingredientname']
      }));
      LikeManager.addWidget(new AjaxSolr.IngredientsListWidget({
        id: 'ingredientsLikes',
        target: '#likeBox'
      }));
      DislikeManager.addWidget(new AjaxSolr.IngredientsListWidget({
        id: 'ingredientsDislikes',
        target: '#dislikeBox'
      }));
  }, 

  addProfilItem = function(username, likes, dislikes) {
    if(username != null) {
      firstProfilLoad = false; 
    emptyIngredientsArray(); 
      makeProfilItem({
        id: "profilItem", 
        username: username
      });
      $('#menuButton').hide();

      
      LikeManager.doRequest(0, 'recipeCollection/select');
      DislikeManager.doRequest(0, 'recipeCollection/select');

      
      for (var i = 0; i < likes.length; i++) {
        addIngredient(likes[i], '#likeBox', 'ingredientsLikes');
      }
      for (var i = 0; i < dislikes.length; i++) {
        addIngredient(dislikes[i], '#dislikeBox', 'ingredientsDislikes');
      }
    } else {
      var text = "das Profil benutzen."; 
      $(that).trigger('addNotLoggedInView', [text]); 
    }
  },

  makeProfilItem = function(options) {
      var item = ProfilItem().init({
        id: options.id,
        username: options.username
      });
      var $el = item.render(); 
      $('#content').append($el);
  },

  onIngredientItemEnter =  function(event) {
      $(event.currentTarget).find(".deleteButton").show(); 
  }, 

  onIngredientItemLeave =  function(event) {
      $(event.currentTarget).find(".deleteButton").hide(); 
  },

  onDeleteButtonClick =  function(event) {
    var id = event.data.id; 
    console.log("deleteButtonClicked", id); 
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
        if(id == 'ingredientsLikes' && !(ingredientsLikesArray.indexOf(value) > -1)) {
          ingredientsLikesArray.push(value); 
        } else if(id == 'ingredientsDislikes' && !(ingredientsDislikesArray.indexOf(value) > -1)) {
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
  that.addProfilItem = addProfilItem; 
  that.addIngredient = addIngredient; 
  that.emptyIngredientsArray = emptyIngredientsArray; 
  that.getLikes = getLikes; 
  that.getDislikes = getDislikes; 
  that.setIngredients = setIngredients; 
  that.initManagers = initManagers; 

  return that; 

})(); 