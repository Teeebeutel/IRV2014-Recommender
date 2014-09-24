var Manager;
var ResultWidget; 
var ImageManager;
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
      fields: ['title', 'ingredientname'], 
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
    /*Manager.addWidget(new AjaxSolr.AddIngredientsWidget({
      id: 'addField',
      target: '#addField',
      field: 'type'
    }));*/
    /*ImageManager.addWidget(new AjaxSolr.ImageSliderWidget({
      id: 'sliderContainer',
      target: '#sliderContainer slider-component', 
      field: 'userRating'
    }));*/
    Manager.addWidget(new AjaxSolr.LevelOfDifficultyWidget({
      id: 'levelOfDifficultySelector',
      target: '#levelOfDifficultySelector',
      field: 'requiredSkill'
    }));
    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
      'facet.field': [ 'ingredientname', 'gluten', 'diabetus', 'lactose', 'sportsman', 'antialc', 'pork', 'vegetarian', 'vegan' ],
      'facet.limit': 20,
      'facet.mincount': 1,
      'json.nl': 'map', 
      'rows': 10
    };
    for (var name in params) {
      Manager.store.addByValue(name, params[name]);
    }

  });
  
  initUI = function() {
    addHomeScreenItem();
    $('#homeMenuItem').on('click', onHomeMenuItemClick); 
    $('#fastAdviceMenuItem').on('click', onFastAdviceMenuItemClick); 
    $('#myRecipesMenuItem').on('click', onMyRecipesMenuItemClick); 
    $('#profilMenuItem').on('click', onProfilMenuItemClick); 
  };

  onHomeMenuItemClick = function(event) {
    emptyContent();
    addHomeScreenItem();
  }; 

  onFastAdviceMenuItemClick = function(event) {
    emptyContent();
    addAdvancedSearchItem();
  };

  onMyRecipesMenuItemClick = function(event) {
    emptyContent();
    addMyRecipesItem();
  }; 

  onProfilMenuItemClick = function(event) {
    emptyContent();
    addProfilItem();
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
      //'facet.limit': 20,
      'sort': 'userRating desc',
      'facet.mincount': 1,
      'json.nl': 'map', 
      'rows': 15
    };
    for (var name in imageManagerParams) {
      ImageManager.store.addByValue(name, imageManagerParams[name]);
    }
    ImageManager.doRequest(0, 'recipeCollection/select');
    /*$('.preselectionKindContainer').each(function() {
        var current = $(this);
        console.log($(this).find('.preselectionLeftArrow'));
        $(document).on('click', $(this).find('.preselectionLeftArrow'), onPreselectionLeftArrowClick);
    });*/
  $('.preselectionLeftArrow').on('click', {'direction': 'left'}, onPreselectionArrowClick);
  $('.preselectionRightArrow').on('click', {'direction': 'right'}, onPreselectionArrowClick);
  $('#preselectionSearchButton').on('click', onPreselectionSearchButtonClick);
 /* Manager.addWidget(new AjaxSolr.PreselectionWidget({
      id: 'preselectionContainer',
      target: '.preselectionContainer',
      //field: 'type'
      fields: ['type', 'vegetarian', 'vegan', 'antialc', 'timetowork', 'requiredSkill'], 
      multivalue: true
    }));*/
  };

  makeHomeScreenItem = function(options) {
    var item = HomeScreenItem().init({
      id: options.id
    });
    var $el = item.render(); 
    $('#content').append($el);
  };

  onPreselectionArrowClick = function(event) {
    var direction = event.data.direction;
    var container = $(event.currentTarget).closest('.preselectionKindContainer');
    var id = container.attr('id')
    var currentImg = container.find('.selectedCard img')
    var leftImg = container.find('.leftCard img');
    var rightImg = container.find('.rightCard img');
    var currentImgSrc = currentImg.attr('src');
    var kindOfMenuItems;

    switch(id) {
      case "preselectionKindOfMenuContainer": 
        kindOfMenuItems = [
          {key: "res/images/keines.png", value: "type:none"}, 
          {key: "res/images/Kaffetasse.png", value: "type:breakfast"}, 
          {key: "res/images/Kochtopf.png", value: "type:mainmeal"}];
        break;
      case "preselectionNutritionConceptContainer":
        kindOfMenuItems = [
          {key: "res/images/vegetarisch.png", value: "vegetarian:true"}, 
          {key: "res/images/vegan.png", value: "vegan:true"}, 
          {key: "res/images/alkoholfrei.png", value: "antialc:true"}];
        break;
      case "preselectionDurationContainer":
        kindOfMenuItems = [
          {key: "res/images/keines.png", value: "timetowork:none"}, 
          {key: "res/images/0min.png", value: "timetowork:[* TO *]"}, 
          {key: "res/images/15min.png", value: "timetowork:[1 TO 15]"}, 
          {key: "res/images/30min.png", value: "timetowork:[16 TO 30]"}, 
          {key: "res/images/45min.png", value: "timetowork:[31 TO 45]"}, 
          {key: "res/images/60min.png", value: "timetowork:[46 TO 60]"}, 
          {key: "res/images/+60min.png", value: "timetowork:[60 TO *]"}];
        break;
      case "preselectionLevelOfDifficultyContainer":
        kindOfMenuItems = [
          {key: "res/images/keines.png", value: "requiredSkill:none"}, 
          {key: "res/images/AmpelGrün.png", value: "requiredSkill:25"}, 
          {key: "res/images/AmpelGelb.png", value: "requiredSkill:50"}, 
          {key: "res/images/AmpelRot.png", value: "requiredSkill:75"}];
        break;
    }
    if(direction == "left") {
      for (var i = 0; i < kindOfMenuItems.length; i++) {
        if(kindOfMenuItems[i].key == currentImgSrc) {
          var newMiddlePosition = (i == 0 ? kindOfMenuItems.length-1 : i-1);
          var newLeftPosition = (newMiddlePosition == 0 ? kindOfMenuItems.length-1 : newMiddlePosition-1);
          currentImg.attr('src', kindOfMenuItems[newMiddlePosition].key);
          currentImg.attr('id', kindOfMenuItems[newMiddlePosition].value);
          rightImg.attr('src', kindOfMenuItems[i].key);
          leftImg.attr('src', kindOfMenuItems[newLeftPosition].key);
        }
      }
    }
    if(direction == "right") {
      for (var i = 0; i < kindOfMenuItems.length; i++) {
        if(kindOfMenuItems[i].key == currentImgSrc) {
          var newMiddlePosition = (i == kindOfMenuItems.length-1 ? 0 : i+1);
          var newRightPosition = (newMiddlePosition == kindOfMenuItems.length-1 ? 0 : newMiddlePosition+1);
          currentImg.attr('src', kindOfMenuItems[newMiddlePosition].key);
          currentImg.attr('id', kindOfMenuItems[newMiddlePosition].value);
          leftImg.attr('src', kindOfMenuItems[i].key);
          rightImg.attr('src', kindOfMenuItems[newRightPosition].key);
        }
      }
    }
  };

  onPreselectionSearchButtonClick = function(event) {
    Manager.store.remove('fq');
    Manager.store.addByValue('q', '*:*');
    $('.selectedCard').each(function() {
      var id = $(this).find('img').attr('id');
      //console.log(id.split(":")[1]);
      
      if(id != undefined) {
        if(id == "type:none" || id == "timetowork:none" || id == "requiredSkill:none") {
        //Manager.store.remove(id.split(":")[0]);
        Manager.store.removeByValue('fq', new RegExp('^'+ id.split(":")[0]+ ':'));
        //Manager.store.removeByValue('fq', new RegExp('^type:'));
      } else {
        Manager.store.addByValue('fq', id);
      }
      }
    });
    Manager.doRequest(0, 'recipeCollection/select');
    $('#mainMenuTabs').prop('selected', 1);
    emptyContent();
    addAdvancedSearchItem();
  };

  addAdvancedSearchItem = function() {
      makeAdvancedSearchItem({
        id: "advancedSearchItem"
      });

      /*Manager.addWidget(new AjaxSolr.AutocompleteWidget({
        id: 'addField',
        target: '#addField',
        fields: ['ingredientname']
      }));*/
      Manager.doRequest(0, 'recipeCollection/select');
      $(document).on('click', '#countSelect core-item', onCountSelectChange);
  }; 

  onCountSelectChange = function(event) {
    var value = $(event.currentTarget).attr('label');
    Manager.store.addByValue('rows', value);
    Manager.doRequest(0, 'recipeCollection/select');
  };

  makeAdvancedSearchItem = function(options) {
      var item = AdvancedSearchItem().init({
        id: options.id
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
  }; 

  makeMyRecipesItem = function(options) {
      var item = MyRecipesItem().init({
        id: options.id
      });
      var $el = item.render(); 
      $('#content').append($el);
  };

  addProfilItem = function() {
      makeProfilItem({
        id: "profilItem"
      });
  };

  makeProfilItem = function(options) {
      var item = ProfilItem().init({
        id: options.id
      });
      var $el = item.render(); 
      $('#content').append($el);
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
