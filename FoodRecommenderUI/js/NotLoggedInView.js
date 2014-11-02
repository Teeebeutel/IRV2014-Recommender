FoodRecommender.NotLoggedInView = (function() {
  var that = {}, 

  init = function() {
    return that; 
  }, 

  addNotLoggedInView = function(text) {
    makeNotLoggedInView({
      id: "notLoggedInItem", 
      text: text
    });
    $('#loginButton').on('click', onLoginButtonClick);
  }, 

  makeNotLoggedInView = function(options) {
      var item = NotLoggedInItem().init({
        id: options.id,
        text: options.text
      });
      var $el = item.render(); 
      $('#content').append($el);
  }, 

  onLoginButtonClick = function(event) {
    $(that).trigger('loginButtonClick'); 
  };

  that.init = init; 
  that.addNotLoggedInView = addNotLoggedInView; 

  return that; 

})(); 