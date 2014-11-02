FoodRecommender.RecipeView = (function() {
	var that = {},  

	init = function() {
	  return that; 
	}, 

	addRecipeItem = function(id, recipeId, title, instructions, timeToWork, vegetarian, vegan, antialc, container, imgSrc) {
    
    var thisVegetarian = vegetarian; 
    var thisVegan = vegan; 
    var thisAntialc = antialc; 
    var timeToWorkImg = getTimeToWorkImg(timeToWork);
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
      thisVegetarian = numberToBoolean(vegetarian);
      thisVegan = numberToBoolean(vegan);
      thisAntialc = numberToBoolean(antialc);
    }
    var images = ""; 
    images += thisVegetarian ? '<img src="./res/images/vegetarisch.png">' : ''; 
    images += thisVegan ? '<img src="./res/images/vegan.png">' : ''; 
    images += thisAntialc ? '<img src="./res/images/alkoholfrei.png">' : ''; 
    images += timeToWorkImg;

      makeRecipeItem({
        resultId: "resultElement" + resultId, 
        recipeId: recipeId,
        title: title,
        id: id,
        snippet: snippet, 
        images: images, 
        container: container, 
        imgSrc: imgSrc
      });

      var img = $('#resultElement'+resultId).find('.recipeImg');
      var url = "http://www.chefkoch.de/rezepte/" + recipeId;
      getImage(url, img);

      var thisTimeToWork = (timeToWork == undefined ? -1 : timeToWork);
      $(document).on('click', '#resultElement' + resultId + ' .addToFavouritesBtn', {'id': id, 'recipeId': recipeId, 'title': title, 'instructions': instructions, 'timeToWork': thisTimeToWork, 'vegetarian': booleanToNumber(thisVegetarian), 'vegan': booleanToNumber(thisVegan), 'antialc': booleanToNumber(thisAntialc)}, onAddToFavouritesBtnClick);
  },  

  makeRecipeItem = function(options) {
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

  getTimeToWorkImg = function(timeToWork) {
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

  booleanToNumber = function(boolean) {
    return (boolean == false ? 0 : 1);
  }, 

  numberToBoolean = function(number) {
    return (number == 0 ? false : true);
  }, 

  onAddToFavouritesBtnClick= function(event) {
    var id = event.data.id;
    var recipeId = event.data.recipeId; 
    var title = event.data.title[0]; 
    var instructions = event.data.instructions; 
    var timeToWork = event.data.timeToWork; 
    var vegetarian  = event.data.vegetarian; 
    var vegan = event.data.vegan; 
    var antialc = event.data.antialc; 
    var imgSrc = $(event.currentTarget).closest('.resultElement').find('img').attr('src');
    $(event.currentTarget).css('color', '#ffc107');
    $(that).trigger('saveRecipe', [id, recipeId, title, instructions, timeToWork, vegetarian, vegan, antialc, imgSrc]);
    /*var data = {id: id, recipeId: recipeId, title: title, instructions: instructions, timeToWork: timeToWork, vegetarian: vegetarian, vegan: vegan, antialc: antialc, imgSrc: imgSrc};
    $.get("php/functions.php?command=saveRecipe", data); */

  }, 

  getImage =  function(url, img) {
    $.get("php/functions.php?command=getImage", {url: url}).done(
    function(data) {
      var json = data; 
      img.attr('src', json);
    });
  };

	that.addRecipeItem = addRecipeItem;
	that.init = init; 
	return that; 
})(); 