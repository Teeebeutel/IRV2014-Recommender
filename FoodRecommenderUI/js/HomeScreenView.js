FoodRecommender.HomeScreenView = (function() {
	var that = {},  
  ImageManager = null, 
  KindOfMenuItems = {}, 
  NutritionConceptItems = {}, 
  DurationItems = {}, 
  LevelOfDifficultyItems = {},

	init = function() {
    ImageManager = new AjaxSolr.Manager({
        solrUrl: 'http://localhost:8983/solr/' 
    });

    KindOfMenuItems = [
          {key: "res/images/keines.png", value: "type:none", title: "ohne Mahlzeittyp"}, 
          {key: "res/images/Kaffetasse.png", value: "type:breakfast", title: "Frühstück"}, 
          {key: "res/images/Kochtopf.png", value: "type:mainmeal", title: "Mittagessen"}]; 
    NutritionConceptItems = [
          {key: "res/images/keines.png", value: "vegetarian:none", title: "ohne Ernährungskonzept"}, 
          {key: "res/images/vegetarisch.png", value: "vegetarian:true", title: "vegetarisch"}, 
          {key: "res/images/vegan.png", value: "vegan:true", title: "vegan"}, 
          {key: "res/images/alkoholfrei.png", value: "antialc:true", title: "alkoholfrei"}]; 
    DurationItems = [
          {key: "res/images/keines.png", value: "timetowork:none", title: "ohne Zeitangabe"}, 
          {key: "res/images/15min.png", value: "timetowork:[1 TO 15]", title: "1-15 min"}, 
          {key: "res/images/30min.png", value: "timetowork:[16 TO 30]", title: "16-30 min"}, 
          {key: "res/images/45min.png", value: "timetowork:[31 TO 45]", title: "31-45 min"}, 
          {key: "res/images/60min.png", value: "timetowork:[46 TO 60]", title: "46-60 min"}, 
          {key: "res/images/+60min.png", value: "timetowork:[60 TO *]", title: "mehr als 60 min"}];
    LevelOfDifficultyItems = [
          {key: "res/images/keines.png", value: "requiredSkill:none", title: "alle Schwierigkeitsstufen"}, 
          {key: "res/images/leicht.png", value: "requiredSkill:25", title: "leicht"}, 
          {key: "res/images/mittel.png", value: "requiredSkill:50", title: "mittel"}, 
          {key: "res/images/schwer.png", value: "requiredSkill:75", title: "schwer"}];

    addHomeScreenItem();
	  return that; 
	}, 

  addHomeScreenItem = function() {
    makeHomeScreenItem({
      id: "homeScreenItem"
    });
  }, 

  makeHomeScreenItem = function(options) {
    var item = FoodRecommender.HomeScreenItem().init({
      id: options.id
    });
    var $el = item.render(); 
    $('#content').append($el);
  }, 

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

  },

  adaptImgSliderHeight = function(event) {
    var imgSlider = $('#sliderContainer');
    var width = imgSlider.width(); 
    imgSlider.height(width * 0.5);
  },

  makeHomeScreenItem = function(options) {
    var item = HomeScreenItem().init({
      id: options.id
    });
    var $el = item.render(); 
    $('#content').append($el);
  },

  onPreselectionArrowClick = function(event) {
    var direction = event.data.direction;
    var container = $(event.currentTarget).closest('.preselectionKindContainer');
    var id = container.attr('id');
    var currentImg = container.find('.selectedCard img');
    var leftImg = container.find('.leftCard img');
    var rightImg = container.find('.rightCard img');
    var currentImgSrc = currentImg.attr('src');
    var currentTitle = container.find('.selectedCard .preselectionTitle'); 
    var leftTitle = container.find('.leftCard .preselectionTitle'); 
    var rightTitle = container.find('.rightCard .preselectionTitle'); 
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
          currentTitle.text(preselectionItems[newMiddlePosition].title);
          leftTitle.text(preselectionItems[newLeftPosition].title); 
          rightTitle.text(preselectionItems[i].title);  

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
          currentTitle.text(preselectionItems[newMiddlePosition].title);
          leftTitle.text(preselectionItems[i].title); 
          rightTitle.text(preselectionItems[newRightPosition].title);  
        }
      }
    }
  },

  onPreselectionSearchButtonClick = function(event) {
    var selectedItems = []; 
    $('.selectedCard').each(function() {
      var id = $(this).find('img').attr('id');
      if(id != undefined) {
        selectedItems.push(id); 
      }
    });
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

    $(that).trigger('preselectionSearchButtonClick', [selectedItems, kindOfMenuNr-1, nutritionConceptNr, durationValue, levelOfDifficultyNr]); 
  }, 

  getDurationValue = function(nr) {
    return nr< 1 ? 0 : nr*15;
  },  

  getImgNr = function(image, object) {
    var nr = 0;
    for (var i = 0; i < object.length; i++) {
      if(object[i].key == image) {
        nr = i;
      }
    }
    return nr;
  };

  that.addHomeScreenItem = addHomeScreenItem;
	that.init = init; 
	return that; 
})(); 