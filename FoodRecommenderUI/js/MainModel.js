FoodRecommender.MainModel = (function() {
	var that = {}; 

	init = function() {
	}, 

	getRecipes = function() {
		$.get("php/functions.php?command=getRecipes").done(
      function(data) {
          var json = data;
          var object = jQuery.parseJSON(json);
          for (var i = 0; i < object.length; i++) {
            $(that).trigger('addRecipeItem', [object[i].id, object[i].recipeId, object[i].title, object[i].instructions, object[i].timeToWork, object[i].vegetarian, object[i].vegan, object[i].antialc, '#myRecipesItem', object[i].imgSrc]);
          }
      });
	}, 

	saveRecipe = function(id, recipeId, title, instructions, timeToWork, vegetarian, vegan, antialc, imgSrc) {
		var data = {id: id, recipeId: recipeId, title: title, instructions: instructions, timeToWork: timeToWork, vegetarian: vegetarian, vegan: vegan, antialc: antialc, imgSrc: imgSrc};
    	$.get("php/functions.php?command=saveRecipe", data);
	}, 

	getProfilData = function(type) {
		$.get("php/functions.php?command=getProfilData").done(
	    function(data) {
	        var object = jQuery.parseJSON(data); 
	        var userName = object['userName']; 
	        var likes = object['likes']; 
	        var dislikes = object['dislikes']; 
	        $(that).trigger('getProfilDataDone', [userName, likes, dislikes, type]); 
	    });
	}
	/*getImage = function(url) {
		$.getJSON("http://query.yahooapis.com/v1/public/yql?"+
                "q=select%20*%20from%20html%20where%20url%3D%22"+
                encodeURIComponent(url)+
                "%22&format=xml'&callback=?",
        function(data){
          if(data.results[0]){
            var data = data.results[0];

            var startIndex = data.indexOf('id="slider"'); 
            if(startIndex == -1) {
              imgUrl = "res/images/Kochtopf.png"; 
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
            imgUrl = "res/images/Kochtopf.png"; 
          }
          $('#imgContainer').attr("src", imgUrl);
        }
      )
	}*/; 
	
	that.init = init; 
	that.getRecipes = getRecipes; 
	that.saveRecipe = saveRecipe; 
	that.getProfilData = getProfilData; 

	return that; 
}()); 