FoodRecommender.MainModel = (function() {
	var that = {}; 

	init = function() {
	}, 

	getImage = function(url) {
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
	}; 
	
	that.init = init; 
	that.getImage = getImage; 

	return that; 
}()); 