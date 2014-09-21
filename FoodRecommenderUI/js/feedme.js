var Manager;

(function ($) {

  $(function () {
    Manager = new AjaxSolr.Manager({

      solrUrl: 'http://localhost:8983/solr/' //recipeCollection/'
      // If you are using a local Solr instance with a "reuters" core, use:
      // solrUrl: 'http://localhost:8983/solr/reuters/'
      // If you are using a local Solr instance with a single core, use:
      // solrUrl: 'http://localhost:8983/solr/'
    });

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
    //Manager.doRequest(0, 'recipeCollection/select');

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
  };

  makeHomeScreenItem = function(options) {
    var item = HomeScreenItem().init({
      id: options.id
    });
    var $el = item.render(); 
    $('#content').append($el);
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
