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
  function (ko, oj, Router, ThemeUtils, moduleUtils, ModuleAnimations, ArrayDataProvider, KnockoutTemplateUtils) {
    function ControllerViewModel() {
      var self = this;
      oj.gOfflineMode = ko.observable(false);
      oj.gModoDependiente = ko.observable(true);
      oj.gWSUrl = ko.observable();
      oj.gConexionDB = ko.observable();
      self.appConfigurada = ko.observable();
      var directorioAndroid = "file:///storage/emulated/0/";

      self.KnockoutTemplateUtils = KnockoutTemplateUtils;

      function procesarParametros(transaccion, resultados) {
        var numFilas = resultados.rows.length;
        for (var indiceFila = 0; indiceFila < numFilas; indiceFila++) {
          switch (resultados.rows.item(indiceFila).nombre) {
            case "desconectada":
              oj.gOfflineMode(resultados.rows.item(indiceFila).valor === "si");
              break;
            case "servidor":
              oj.gWSUrl(resultados.rows.item(indiceFila).valor + "/SISVANWS/rest/wls/1.0/");
              break;
            case "modo":
              oj.gModoDependiente(resultados.rows.item(indiceFila).valor === "dependiente");
              break;
            case "configurada":
              self.appConfigurada(resultados.rows.item(indiceFila).valor === "si");
              break;
          }
        }
      }

      function manejarErrores(error) {
        alert("Error durante la inicialización, intente reiniciando la aplicación, si la falla persiste contecte al soporte técnico");
        console.log("Error en la base de datos: " + error.message);
      }

      document.addEventListener("deviceready", function () {
        oj.gConexionDB(window.sqlitePlugin.openDatabase({ name: "sve-base-datos.db", location: 'default', createFromLocation: 1 }));
        oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql("SELECT * from parametros",
            [], procesarParametros, manejarErrores);
        }, function (error) {
          alert("Error durante la inicialización, intente reiniciando la aplicación, si la falla persiste contecte al soporte técnico.");
          console.log("Error en la base de datos: " + error.message);
        });
      }, false);

      // Handle announcements sent when pages change, for Accessibility.
      self.manner = ko.observable('polite');
      self.message = ko.observable();

      document.getElementById('globalBody').addEventListener('announce', announcementHandler, false);

      function announcementHandler(event) {
        setTimeout(function () {
          self.message(event.detail.message);
          self.manner(event.detail.manner);
        }, 200);
      };

      // Save the theme so we can perform platform specific navigational animations
      var platform = ThemeUtils.getThemeTargetPlatform();

      // Navigation setup
      var navData = [
        {
          name: 'Bienvenido', id: 'config',
        }
      ];

      // Router setup
      self.router = Router.rootInstance;

      if (self.appConfigurada() === true) {
        navData = [
          {
            name: 'Colectivas', id: 'evalGrup',
            iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24'
          },
          {
            name: 'Individuales', id: 'evalIndv',
            iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-person-icon-24'
          },
          {
            name: 'Estadísticas', id: 'estUtils',
            iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'
          }
        ];

        if (oj.gModoDependiente() !== true) {
          self.router.configure({
            'evalGrup': { label: 'Evaluaciones colectivas', isDefault: true },
            'evalIndv': { label: 'Evaluación individual' },
            'estUtils': { label: 'Estadísticas OMS' },
            'datEsc': { label: 'Datos escolares' }
          });
          navData.push({
            name: 'Escolares', id: 'datEsc',
            iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-library-icon-24'
          });
        } else {
          self.router.configure({
            'evalGrup': { label: 'Evaluaciones colectivas', isDefault: true },
            'evalIndv': { label: 'Evaluación individual' },
            'estUtils': { label: 'Estadísticas OMS' }
          });
        }
      } else {
        self.router.configure({
          'config': { label: 'Bienvenido', isDefault: true }
        });
      }

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
          return moduleUtils.createConfig({
            viewPath: viewPath,
            viewModelPath: modelPath, params: { parentRouter: self.router }
          });
        });
      };
      self.moduleAnimation = ModuleAnimations.switcher(switcherCallback);

      function manejarErrores() {
        alert("Problemas durante la descarga favor de contactar al administrador.");
      }

      function escribirArchivo(direccionArchivo, binario) {
        direccionArchivo.createWriter(function (writer) {
          writer.onwriteend = function () {
            alert("El archivo ha sido guardado en la carpeta de Descargas.");
          };

          writer.seek(0);
          writer.write(binario);

        }, manejarErrores);
      }

      // Funcion global para el guardado de archivos
      oj.gGuardarArchivos = function (nombre, binario) {
        window.resolveLocalFileSystemURL(directorioAndroid, function (directorioSistema) {
          directorioSistema.getDirectory("Download", {
            create: true,
            exclusive: false
          },
            function (directorio) {
              //Aqui se especifica el nombre del archivo
              var fechaActual = new Date();
              var fechaRegistro = fechaActual.toJSON().slice(0, 19);
              fechaRegistro = fechaRegistro.replace("T", "-").replace(":", "-").replace(":", "-");
              var nombreFinal = nombre.split(".")[0] + "-" + fechaRegistro + "." + nombre.split(".")[1];
              directorio.getFile(nombreFinal, {
                create: true,
                exclusive: false
              },
                function (direccionArchivo) {
                  escribirArchivo(direccionArchivo, binario)
                }, manejarErrores);
            }, manejarErrores);
        }, manejarErrores);
      };




      self.navDataProvider = new ArrayDataProvider(navData, { keyAttributes: 'id' });

      // Header Setup
      self.getHeaderModel = function () {
        this.pageTitle = self.router.currentState().label;

        this.transitionCompleted = function () {
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
          contentElem.style.paddingTop = topElem.offsetHeight + 'px';
        }
        if (bottomElem) {
          contentElem.style.paddingBottom = bottomElem.offsetHeight + 'px';
        }
        // Add oj-complete marker class to signal that the content area can be unhidden.
        // See the override.css file to see when the content area is hidden.
        contentElem.classList.add('oj-complete');
      }
    }

    return new ControllerViewModel();
  }
);
