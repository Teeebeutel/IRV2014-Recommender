LoginView = (function() {
  var that = {}, 

  init = function() {
    addLoginOverlayItem();
    return that; 
  }, 
  
  addLoginOverlayItem = function() {
    makeLoginOverlayItem({
      id: "loginOverlayItem"
    });
    $('#toRegistrationViewButton').on('click', onToRegistrationButtonClick);
    $('#loginButton').on('click', onLoginButtonClick);
    $('#withoutLoginButton').on('click', onWithoutLoginButtonClick);
  }, 

  showErrorMessageOrHide = function(type) {
    if(type == "wrong") {
      $('#loginErrorMessage').show();
    } else if (type == "right") {
      hideOverlay();
    }
  }, 

  onLoginButtonClick = function(event) {
    var username = $('#loginUsernameInput').get(0).value;
    var password = $('#loginPasswordInput').get(0).value;
    var data = {username: username, password: password};
    $.get("php/functions.php?command=checkUser", data).done(
    function(data) {
      showErrorMessageOrHide(data);
    });
  }, 

  onWithoutLoginButtonClick = function(event) {
    hideOverlay();
  }, 

  onToRegistrationButtonClick = function(event) {
    $('#loginOverlayContainer').remove();
    addRegistrationOverlayItem();
  }, 

  onRegistrationButtonClick = function(event) {
    var username = $('#registrationUsernameInput').get(0).value;
    var password = $('#registrationPasswordInput').get(0).value;
    var passwordConfirm = $('#registrationPasswordConfirmInput').get(0).value;
    if(password == "" && username == "") {
      $('#loginErrorMessage').text("Bitte Nutzername und Passwort eingeben").show();
    } else if(password == "") {
      $('#loginErrorMessage').text("Bitte Passwort eingeben").show();
    } else if(passwordConfirm == "") {
      $('#loginErrorMessage').text("Bitte Passwortwiederholung eingeben").show();
    } else if(username == "") {
      $('#loginErrorMessage').text("Bitte Nutzername eingeben").show();
    } else if(password != passwordConfirm) {
      $('#loginErrorMessage').text("Das Passwort und die Passwortwiederholung stimmen nicht überein").show();
    } else if(password.length <= 8) {
      $('#loginErrorMessage').text("Das Passwort muss mindestens 8 Zeichen lang sein").show();
    } else if(password == passwordConfirm && password.length >= 8) {
      var data = {username: username, password: password};
      $.get("php/functions.php?command=saveNewUser", data); 
      $('#loginErrorMessage').hide();
      hideOverlay();
    } else {
      $('#loginErrorMessage').show();
    }
  },

  hideOverlay = function() {
    $('body').removeClass('avoidScrolling');
    $('#loginOverlayItem').hide();
  }, 

  addRegistrationOverlayItem = function() {
    makeRegistrationOverlayItem({
      id: "registrationOverlayContainer"
    });
    $('#registrationButton').on('click', onRegistrationButtonClick);
  }, 

  makeRegistrationOverlayItem = function(options) {
    var item = RegistrationOverlayItem().init({
      id: options.id
    }); 
    var $el = item.render(); 
    $('#loginOverlayItem').append($el); 
  }, 

  makeLoginOverlayItem = function(options) {
    var item = LoginOverlayItem().init({
      id: options.id
    }); 
    var $el = item.render(); 
    $('body').attr('class', 'avoidScrolling');
    $('body').append($el); 
  };

  that.init = init; 
  that.showErrorMessageOrHide = showErrorMessageOrHide; 

  return that; 

})(); 