/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

/*
 * Your application specific code will go here
 */
define(['knockout', 'ojs/ojcore', 'ojs/ojrouter', 'ojs/ojthemeutils', 'ojs/ojmodule-element-utils', 'ojs/ojmoduleanimations', 'ojs/ojarraydataprovider', 'ojs/ojknockouttemplateutils', 'ojs/ojknockout', 'ojs/ojmodule-element'],
  function(ko, oj, Router, ThemeUtils, moduleUtils, ModuleAnimations, ArrayDataProvider, KnockoutTemplateUtils) {
     function ControllerViewModel() {
      var self = this;
      oj.gOfflineMode = ko.observable(false);
      oj.gWSUrl = ko.observable("https://sve-nace.freeddns.org/SISVANWS/rest/wls/1.0/");

      self.KnockoutTemplateUtils = KnockoutTemplateUtils;

      function querySuccess(tx, results) {
        var len = results.rows.length;
        for (var i = 0; i < len; i++) {
          console.log(results.rows.item(i).cuentaPeso);
        }
      }

      function errorCB(err) {
        console.log("Error processing SQL: " + err.code);
      }

      var db = null;
      document.addEventListener("deviceready", function(){
          db = window.sqlitePlugin.openDatabase({name: "sve-base-datos.db", location: 'default', createFromLocation: 1});          
          db.transaction(function(tx) {
            tx.executeSql("SELECT COUNT(*) as cuentaPeso from percentiles_oms_peso",
            [], querySuccess, errorCB);
              //tx.executeSql("CREATE TABLE IF NOT EXISTS TEST (name text primary key)");              
          }, function(err){
              alert("An error occurred while initializing the app");
          });
      }, false);

      // Handle announcements sent when pages change, for Accessibility.
      self.manner = ko.observable('polite');
      self.message = ko.observable();

      document.getElementById('globalBody').addEventListener('announce', announcementHandler, false);

      function announcementHandler(event) {
        setTimeout(function() {
          self.message(event.detail.message);
          self.manner(event.detail.manner);
        }, 200);
      };

      // Save the theme so we can perform platform specific navigational animations
      var platform = ThemeUtils.getThemeTargetPlatform();

      // Router setup
      self.router = Router.rootInstance;

      self.router.configure({
       'evalGrup': {label: 'Evaluaciones colectivas', isDefault: true},
       'evalIndv': {label: 'Evaluación individual'},
       'estUtils': {label: 'Estadísticas OMS'},
       'datEsc': {label: 'Datos escolares'}
      });

      Router.defaults['urlAdapter'] = new Router.urlParamAdapter();
      // Callback function that can return different animations based on application logic.
      function switcherCallback(context) {
        if (platform === 'android')
          return 'fade';
        return null;
      };

      self.loadModule = function () {
        self.moduleConfig = ko.pureComputed(function () {
          var name = self.router.moduleConfig.name();
          var viewPath = 'views/' + name + '.html';
          var modelPath = 'viewModels/' + name;
          return moduleUtils.createConfig({ viewPath: viewPath,
            viewModelPath: modelPath, params: { parentRouter: self.router } });
        });
      };
      self.moduleAnimation = ModuleAnimations.switcher(switcherCallback);

      // Navigation setup
      var navData = [
      {name: 'Colectivas', id: 'evalGrup',
       iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24'},
      {name: 'Individuales', id: 'evalIndv',
       iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-person-icon-24'},
      {name: 'Estadísticas', id: 'estUtils',
       iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'},
      {name: 'Escolares', id: 'datEsc',
       iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-library-icon-24'}
     ];

      self.navDataProvider = new ArrayDataProvider(navData, {keyAttributes: 'id'});

      // Header Setup
      self.getHeaderModel = function() {
        this.pageTitle = self.router.currentState().label;
        
        this.transitionCompleted = function() {
          // Adjust content padding after header bindings have been applied
          var headerElem = document.getElementsByClassName('oj-hybrid-applayout-header')[0].children[0];
          headerElem.classList.add('header-container');
          self.adjustContentPadding();
        }
      };

      // Method for adjusting the content area top/bottom paddings to avoid overlap with any fixed regions.
      // This method should be called whenever your fixed region height may change.  The application
      // can also adjust content paddings with css classes if the fixed region height is not changing between
      // views.
      self.adjustContentPadding = function () {
        var topElem = document.getElementsByClassName('oj-applayout-fixed-top')[0];
        var contentElem = document.getElementsByClassName('oj-applayout-content')[0];
        var bottomElem = document.getElementsByClassName('oj-applayout-fixed-bottom')[0];

        if (topElem) {
          contentElem.style.paddingTop = topElem.offsetHeight+'px';
        }
        if (bottomElem) {
          contentElem.style.paddingBottom = bottomElem.offsetHeight+'px';
        }
        // Add oj-complete marker class to signal that the content area can be unhidden.
        // See the override.css file to see when the content area is hidden.
        contentElem.classList.add('oj-complete');
      }
    }

    return new ControllerViewModel();
  }
);
