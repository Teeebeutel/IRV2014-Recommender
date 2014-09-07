FoodRecommender.RecommenderView = (function() {
	var that = {}, 
  //imgUrl = null, 

	init = function() {
    $('#search-button').on('click', onButtonClick); 
    $('#input-field').on('click', onInputFieldClick); 
    //quelle: http://christianheilmann.com/2010/01/10/loading-external-content-with-ajax-using-jquery-and-yql/
    //var url = "http://www.chefkoch.de/rezepte/442091136325053/Topfenstrudel-mit-Fruechten.html";
    //var url = "http://www.chefkoch.de/rezepte/603451160109487/Schokolade-Kuchen-mit-fluessigem-Kern-la-Italia.html"; 
    //var url = "http://www.chefkoch.de/rezepte/555111153218740/Schokoladensirup.html"; 
    //var url = "http://www.chefkoch.de/rezepte/629891163497995/Solero-Cocktail.html"; 
    //var url = "http://www.chefkoch.de/rezepte/2573521403087149/Schinkenbraten-mit-Kaesekruste-la-Gabi.html"; 
    //var url = "http://www.chefkoch.de/rezepte/1745821283799601/Vegetarische-Lasagne-mit-Auberginen.html"; 
    var url = $('#input-field').val(); 
	  return that; 
	}, 
      onButtonClick = function() {
        var url = $('#input-field').val(); 
        $(that).trigger('getImage', [url]); 
      }, 
      onInputFieldClick = function() {
        $(this).val(''); 
      };

	that.init = init; 
	return that; 
})(); 