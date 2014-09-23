(function ($) {

AjaxSolr.ImageSliderWidget = AjaxSolr.AbstractFacetWidget.extend({
   
  afterRequest: function () {
    var self = this;
    //self.manager.executeRequest('select/recipeCollection', '?q=*%3A*&facet=true&facet…egan&facet.limit=20&facet.mincount=1&json.nl=map&rows=10&wt=json&json.wrf=?');
    //this.facetHandler(facet_field, facet_values[i])
    console.log(this.target);
    var i = 0; 
    var docs = this.manager.response.response.docs;
    var doc; 
    //for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
    $('#sliderContainer slider-component /deep/ img').each(function() {
      doc = docs[i];
      console.log(doc);
      var img = $(this);
      //var listItems = $( "#sliderContainer slider-component img:gt(0)" );
      self.getImage(doc.url, img);
      i++;
      //$(this.target).append('<img src="'+ self.getImage(doc.url) + '">');
    });
  }, 

  getImage: function(url, img) {
    $.get("php/functions.php?command=getImage", {url: url}).done(
    function(data) {
      var json = data; 
      console.log(json);
      
      img.attr('src', json);
    });
  }

  
});

})(jQuery);
