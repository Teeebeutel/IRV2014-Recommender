var Manager, ResultWidget, ImageManager;
var UserHandler, LoginView, ProfilView;
var KindOfMenuItems, NutritionConceptItems, DurationItems, LevelOfDifficultyItems;
var firstProfilLoad, userName, selected; 

(function ($) {

  $(function () {
    Manager = new AjaxSolr.Manager({
      solrUrl: 'http://localhost:8983/solr/' //recipeCollection/'
      // If you are using a local Solr instance with a "reuters" core, use:
      // solrUrl: 'http://localhost:8983/solr/reuters/'
      // If you are using a local Solr instance with a single core, use:
      // solrUrl: 'http://localhost:8983/solr/'
    });
    ImageManager = new AjaxSolr.Manager({
      solrUrl: 'http://localhost:8983/solr/' 
    });
    LikeManager = new AjaxSolr.Manager({
      solrUrl: 'http://localhost:8983/solr/' 
    }); 
    DislikeManager = new AjaxSolr.Manager({
      solrUrl: 'http://localhost:8983/solr/' 
    }); 
    ResultWidget = new AjaxSolr.ResultWidget();
    initUI();

    Manager.addWidget(new AjaxSolr.ResultWidget({
      id: 'result',
      target: '#docs'
    }));
    Manager.addWidget(new AjaxSolr.PagerWidget({
      id: 'pager',
      target: '#pager',
      prevLabel: '&lt;',
      nextLabel: '&gt;',
      innerWindow: 1
    }));
    Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
      id: 'currentsearch',
      target: '#selection'
    }));
    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'text',
      target: '#search',
      fields: ['titleStop', 'ingredientname'], 
      multivalue: true
    }));
    Manager.addWidget(new AjaxSolr.KindOfMenuWidget({
      id: 'kindOfMenuSelector',
      target: '#kindOfMenuSelector',
      field: 'type'
    }));
    var fields = ['vegetarian', 'vegan', 'antialc'];
    for (var i = 0, l = fields.length; i < l; i++) {
      Manager.addWidget(new AjaxSolr.NutritionConceptWidget({
        id: fields[i],
        target: '#' + fields[i], 
        field: fields[i]
      }));
    }
    Manager.addWidget(new AjaxSolr.DurationWidget({
      id: 'durationSelect',
      target: '#durationSelect',
      field: 'timetowork'
    }));
    Manager.addWidget(new AjaxSolr.LevelOfDifficultyWidget({
      id: 'levelOfDifficultySelector',
      target: '#levelOfDifficultySelector',
      field: 'requiredSkill'
    }));
    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
      'facet.limit': 20,
      'facet.mincount': 1,
      'json.nl': 'map', 
      'rows': 10
    };
    for (var name in params) {
      Manager.store.addByValue(name, params[name]);
    }
    
    Manager.doRequest(0, 'recipeCollection/select');

  });
  
  initUI = function() {
    KindOfMenuItems = [
          {key: "res/images/keines.png", value: "type:none"}, 
          {key: "res/images/Kaffetasse.png", value: "type:breakfast"}, 
          {key: "res/images/Kochtopf.png", value: "type:mainmeal"}]; 
    NutritionConceptItems = [
          {key: "res/images/keines.png", value: "vegetarian:none"}, 
          {key: "res/images/vegetarisch.png", value: "vegetarian:true"}, 
          {key: "res/images/vegan.png", value: "vegan:true"}, 
          {key: "res/images/alkoholfrei.png", value: "antialc:true"}]; 
    DurationItems = [
          {key: "res/images/keines.png", value: "timetowork:none"}, 
          {key: "res/images/0min.png", value: "timetowork:none"}, 
          {key: "res/images/15min.png", value: "timetowork:[1 TO 15]"}, 
          {key: "res/images/30min.png", value: "timetowork:[16 TO 30]"}, 
          {key: "res/images/45min.png", value: "timetowork:[31 TO 45]"}, 
          {key: "res/images/60min.png", value: "timetowork:[46 TO 60]"}, 
          {key: "res/images/+60min.png", value: "timetowork:[60 TO *]"}];
    LevelOfDifficultyItems = [
          {key: "res/images/keines.png", value: "requiredSkill:none"}, 
          {key: "res/images/leicht.png", value: "requiredSkill:25"}, 
          {key: "res/images/mittel.png", value: "requiredSkill:50"}, 
          {key: "res/images/schwer.png", value: "requiredSkill:75"}];

    addHomeScreenItem();
    $('#homeMenuItem').on('click', onHomeMenuItemClick); 
    $('#fastAdviceMenuItem').on('click', onFastAdviceMenuItemClick); 
    $('#myRecipesMenuItem').on('click', onMyRecipesMenuItemClick); 
    $('#profilMenuItem').on('click', onProfilMenuItemClick); 
    $('#searchTypeSelect').on('click', 'core-item', onSearchTypeSelectChange); 

    $.get("php/functions.php?command=getProfilData").done(
      function(data) {
        var object = jQuery.parseJSON(data); 
        userName = object['userName']; 
        ProfilView.setIngredients(object['likes'], object['dislikes']); 
    });

    /*this is for the page to be scrolled to the top on page refresh*/
    $(window).on('beforeunload', function() {
      $(window).scrollTop(0);
    });

    LoginView.init();
    ProfilView.init();
    UserHandler.init();
    firstProfilLoad = true; 
  };

  onSearchTypeSelectChange = function(event) {
    var newSelection = $(event.currentTarget).attr('id'); 
    selected = newSelection; 
    adaptSearchToSearchType(newSelection); 
    Manager.doRequest(0, 'recipeCollection/select');
  }; 

  adaptSearchToSearchType = function(selection) {
    if(selection == "frei") {
      var likes = ProfilView.getLikes(); 
      var dislikes = ProfilView.getDislikes(); 
      for (var i = 0; i < likes.length; i++) {
        Manager.store.removeByValue('fq', new RegExp("'" + likes[i] + "'"));
      }
      for (var i = 0; i < dislikes.length; i++) {
        Manager.store.removeByValue('fq', new RegExp("'!" + dislikes[i] + "'"));
      }
      Manager.store.remove('fq');
    } else if(selection == "profilbezogen") {
      addUserPreferences(Manager);

    }
  }; 

  addUserPreferences = function (Manager) {
    UserHandler.addPreferences(Manager);
  };

  onHomeMenuItemClick = function(event) {
    emptyContent();
    addHomeScreenItem();
  }; 

  onFastAdviceMenuItemClick = function(event) {
    emptyContent();
    addAdvancedSearchItem(-1, 0, 0, 0);
    Manager.store.remove('fq');
  };

  onMyRecipesMenuItemClick = function(event) {
    emptyContent();
    addMyRecipesItem();
  }; 

  onProfilMenuItemClick = function(event) {
    emptyContent();
    getProfilInformation();
  };

  addHomeScreenItem = function() {
    makeHomeScreenItem({
      id: "homeScreenItem"
    });
    ImageManager.addWidget(new AjaxSolr.ImageSliderWidget({
      id: 'sliderContainer',
      target: '#sliderContainer slider-component', 
      field: 'userRating'
    }));
    
    ImageManager.init();
    ImageManager.store.addByValue('q', '*:*');
    var imageManagerParams = {
      facet: true,
      'facet.field': ['userRating'],
      'sort': 'userRating desc',
      'facet.mincount': 1,
      'json.nl': 'map', 
      'rows': 20
    };
    for (var name in imageManagerParams) {
      ImageManager.store.addByValue(name, imageManagerParams[name]);
    }
    ImageManager.doRequest(0, 'recipeCollection/select');
    adaptImgSliderHeight();
    $('.preselectionLeftArrow').on('click', {'direction': 'left'}, onPreselectionArrowClick);
    $('.preselectionRightArrow').on('click', {'direction': 'right'}, onPreselectionArrowClick);
    $('#preselectionSearchButton').on('click', onPreselectionSearchButtonClick);
    $('#sliderContainer slider-component /deep/ #container').attr('height'); 
    $(window).on('resize', adaptImgSliderHeight);
    $('#menuButton').hide();

  };

  adaptImgSliderHeight = function(event) {
    var imgSlider = $('#sliderContainer');
    var width = imgSlider.width(); 
    imgSlider.height(width * 0.5);
  };

  makeHomeScreenItem = function(options) {
    var item = HomeScreenItem().init({
      id: options.id
    });
    var $el = item.render(); 
    $('#content').append($el);
  };

  onMenuButtonClick = function(event) {
      var drawerPanel = document.getElementById('drawerPanel');
      drawerPanel.togglePanel();
  };

  onPreselectionArrowClick = function(event) {
    var direction = event.data.direction;
    var container = $(event.currentTarget).closest('.preselectionKindContainer');
    var id = container.attr('id');
    var currentImg = container.find('.selectedCard img');
    var leftImg = container.find('.leftCard img');
    var rightImg = container.find('.rightCard img');
    var currentImgSrc = currentImg.attr('src');
    var preselectionItems;

    switch(id) {
      case "preselectionKindOfMenuContainer": 
        preselectionItems = KindOfMenuItems;
        break;
      case "preselectionNutritionConceptContainer":
        preselectionItems = NutritionConceptItems;
        break;
      case "preselectionDurationContainer":
        preselectionItems = DurationItems;
        break;
      case "preselectionLevelOfDifficultyContainer":
        preselectionItems = LevelOfDifficultyItems;
        break;
    }
    if(direction == "left") {
      for (var i = 0; i < preselectionItems.length; i++) {
        if(preselectionItems[i].key == currentImgSrc) {
          var newMiddlePosition = (i == 0 ? preselectionItems.length-1 : i-1);
          var newLeftPosition = (newMiddlePosition == 0 ? preselectionItems.length-1 : newMiddlePosition-1);
          currentImg.attr('src', preselectionItems[newMiddlePosition].key);
          currentImg.attr('id', preselectionItems[newMiddlePosition].value);
          rightImg.attr('src', preselectionItems[i].key);
          leftImg.attr('src', preselectionItems[newLeftPosition].key);
        }
      }
    }
    if(direction == "right") {
      for (var i = 0; i < preselectionItems.length; i++) {
        if(preselectionItems[i].key == currentImgSrc) {
          var newMiddlePosition = (i == preselectionItems.length-1 ? 0 : i+1);
          var newRightPosition = (newMiddlePosition == preselectionItems.length-1 ? 0 : newMiddlePosition+1);
          currentImg.attr('src', preselectionItems[newMiddlePosition].key);
          currentImg.attr('id', preselectionItems[newMiddlePosition].value);
          leftImg.attr('src', preselectionItems[i].key);
          rightImg.attr('src', preselectionItems[newRightPosition].key);
        }
      }
    }
  };

  onPreselectionSearchButtonClick = function(event) {
    Manager.store.remove('fq');
    Manager.store.addByValue('q', '*:*');
    /*TODO: add "insert preferences*/
    addUserPreferences(Manager);
    $('.selectedCard').each(function() {
      var id = $(this).find('img').attr('id');
      if(id != undefined) {
        if(id == "type:none" || id == "timetowork:none" || id == "requiredSkill:none") {
          Manager.store.removeByValue('fq', new RegExp('^'+ id.split(":")[0]+ ':'));
        } else if(id == "vegetarian:none") {
          Manager.store.removeByValue('fq', new RegExp('^vegetarian:'));
          Manager.store.removeByValue('fq', new RegExp('^vegan:'));
          Manager.store.removeByValue('fq', new RegExp('^antialc:'));
        } else {
          Manager.store.addByValue('fq', id);
        }
      }
    });
    Manager.doRequest(0, 'recipeCollection/select');
    $('#mainMenuTabs').prop('selected', 1);

    var kindOfMenuImg = $('#preselectionKindOfMenuContainer .selectedCard img').attr('src');
    var nutritionConceptImg = $('#preselectionNutritionConceptContainer .selectedCard img').attr('src');
    var durationImg = $('#preselectionDurationContainer .selectedCard img').attr('src');
    var levelOfDifficultyImg = $('#preselectionLevelOfDifficultyContainer .selectedCard img').attr('src');

    var durationImgNr = getImgNr(durationImg, DurationItems);
    kindOfMenuNr = getImgNr(kindOfMenuImg, KindOfMenuItems); 
    nutritionConceptNr = getImgNr(nutritionConceptImg, NutritionConceptItems);
    durationValue = getDurationValue(durationImgNr);
    levelOfDifficultyNr = getImgNr(levelOfDifficultyImg, LevelOfDifficultyItems); 

    emptyContent();
    addAdvancedSearchItem(kindOfMenuNr-1, nutritionConceptNr, durationValue, levelOfDifficultyNr);
  };

  getDurationValue = function(nr) {
    return nr<= 1 ? 0 : (nr-1)*15;
  };  

  getImgNr = function(image, object) {
    var nr = 0;
    for (var i = 0; i < object.length; i++) {
      if(object[i].key == image) {
        nr = i;
      }
    }
    return nr;
  };

  addAdvancedSearchItem = function(kindOfMenuNr, nutritionConceptNr, durationValue, levelOfDifficultyNr) {
      makeAdvancedSearchItem({
        id: "advancedSearchItem", 
        kindOfMenuNr: kindOfMenuNr, 
        nutritionConceptNr: nutritionConceptNr, 
        durationValue: durationValue, 
        levelOfDifficultyNr: levelOfDifficultyNr
      });
     if(kindOfMenuNr != -1) {
        $('.kindOfMenuContainer:eq(' + kindOfMenuNr +')').append('<div class="selectionMark"><div class="iconDiv"></div><core-icon icon="check"></core-icon></div>');
     }
      

      $('#menuButton').show().on('click', onMenuButtonClick); 
      Manager.addWidget(new AjaxSolr.AutocompleteWidget({
        id: 'addField',
        target: '#addField',
        fields: ['ingredientname']
      }));
      adaptSearchToSearchType(selected); 
      Manager.doRequest(0, 'recipeCollection/select');
      $(document).on('click', '#countSelect core-item', onCountSelectChange);
      $(document).on('click', '#noNutritionConcept', onNutritionConceptDeselect);
  }; 

  onNutritionConceptDeselect = function(event) {
    Manager.store.removeByValue('fq', new RegExp('^vegetarian:'));
    Manager.store.removeByValue('fq', new RegExp('^vegan:'));
    Manager.store.removeByValue('fq', new RegExp('^antialc:'));
    Manager.doRequest(0, 'recipeCollection/select');
  };

  onCountSelectChange = function(event) {
    var value = $(event.currentTarget).attr('label');
    Manager.store.addByValue('rows', value);
    Manager.doRequest(0, 'recipeCollection/select');
  };

  makeAdvancedSearchItem = function(options) {
      var item = AdvancedSearchItem().init({
        id: options.id, 
        kindOfMenuNr: options.kindOfMenuNr, 
        nutritionConceptNr: options.nutritionConceptNr, 
        durationValue: options.durationValue, 
        levelOfDifficultyNr: options.levelOfDifficultyNr
      });
      var $el = item.render(); 
      $('#content').append($el);
  };

  addMyRecipesItem = function() {
      makeMyRecipesItem({
        id: "myRecipesItem"
      });
      $.get("php/functions.php?command=getRecipes").done(
        function(data) {
          var json = data;
          var object = jQuery.parseJSON(json);
          for (var i = 0; i < object.length; i++) {
            ResultWidget.addRecipeItem(object[i].id, object[i].recipeId, object[i].title, object[i].instructions, object[i].timeToWork, object[i].vegetarian, object[i].vegan, object[i].antialc, '#myRecipesItem', object[i].imgSrc);
          }
      });
      $('#menuButton').hide();
  }; 

  makeMyRecipesItem = function(options) {
      var item = MyRecipesItem().init({
        id: options.id
      });
      var $el = item.render(); 
      $('#content').append($el);
  };

  getProfilInformation = function() {
    /*if(firstProfilLoad == true) {
      $.get("php/functions.php?command=getProfilData").done(
      function(data) {
        var object = jQuery.parseJSON(data); 
        userName = object['userName']; 
        addProfilItem(userName, object['likes'], object['dislikes']);
      });
    } else {
      addProfilItem(userName, ProfilView.getLikes(), ProfilView.getDislikes()); 
    }*/
    addProfilItem(userName, ProfilView.getLikes(), ProfilView.getDislikes()); 
  };

  addProfilItem = function(username, likes, dislikes) {
    firstProfilLoad = false; 
    ProfilView.emptyIngredientsArray(); 
      makeProfilItem({
        id: "profilItem", 
        username: username
      });
      $('#menuButton').hide();

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
      LikeManager.doRequest(0, 'recipeCollection/select');
      DislikeManager.doRequest(0, 'recipeCollection/select');

      
      for (var i = 0; i < likes.length; i++) {
        ProfilView.addIngredient(likes[i], '#likeBox', 'ingredientsLikes');
      }
      for (var i = 0; i < dislikes.length; i++) {
        ProfilView.addIngredient(dislikes[i], '#dislikeBox', 'ingredientsDislikes');
      }
  };

  makeProfilItem = function(options) {
      var item = ProfilItem().init({
        id: options.id,
        username: options.username
      });
      var $el = item.render(); 
      $('#content').append($el);
  };

  onKeyUpInSearchField = function(event) {
    if(event.which == 13) {
      emptyContent();
      addAdvancedSearchItem(-1, 0, 0, 0);
    }
  };

  emptyContent = function() {
    $('#content').empty();
  };

  $.fn.showIf = function (condition) {
    if (condition) {
      return this.show();
    }
    else {
      return this.hide();
    }
  }

})(jQuery);
