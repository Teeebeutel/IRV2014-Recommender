(function ($) {

AjaxSolr.ImageSliderWidget = AjaxSolr.AbstractFacetWidget.extend({
   
  afterRequest: function () {
    var self = this;

    var i = 0; 
    var docs = this.manager.response.response.docs;
    var doc; 
    $('#sliderContainer slider-component /deep/ img').each(function() {
      doc = docs[i];
      var img = $(this);
      console.log(doc.url, doc.title);
      self.getImage(doc.url, img);
      i++;
    });
  }, 

  getImage: function(url, img) {
    $.get("php/functions.php?command=getImage", {url: url}).done(
    function(data) {
      console.log(data);
      img.attr('src', data);
    });
  }

  
});

})(jQuery);
