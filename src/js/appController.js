/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

/*
 * Your application specific code will go here
 */
define(['knockout', 'ojs/ojcore', 'ojs/ojrouter', 'ojs/ojthemeutils', 'ojs/ojmodule-element-utils', 
'ojs/ojmoduleanimations', 'ojs/ojarraydataprovider', 'ojs/ojknockouttemplateutils', 'ojs/ojasyncvalidator-regexp', 'ojs/ojknockout', 
'ojs/ojmodule-element', 'ojs/ojdialog', 'ojs/ojbutton', 'ojs/ojinputtext'],
  function (ko, oj, Router, ThemeUtils, moduleUtils, ModuleAnimations, ArrayDataProvider, KnockoutTemplateUtils, AsyncRegExpValidator) {
    function ControllerViewModel() {
      var self = this;
      var navData = [];
      oj.gOfflineMode = ko.observable(false);
      oj.gModoDependiente = ko.observable(true);
      oj.gWSUrl = ko.observable();
      oj.servidor = ko.observable();
      oj.contrasenia = ko.observable();
      oj.nuevaContrasenia = ko.observable();
      oj.confContrasenia = ko.observable();
      oj.gConexionDB = ko.observable();
      oj.gUsuario = ko.observable();
      oj.gContrasenia = ko.observable();
      self.navDataProvider = ko.observable(new ArrayDataProvider(navData, { keyAttributes: 'id' }));
      oj.gAppConfigurada = ko.observable();
      var directorioAndroid = "file:///storage/emulated/0/";

      self.KnockoutTemplateUtils = KnockoutTemplateUtils;

      function procesarParametros(transaccion, resultados) {
        var numFilas = resultados.rows.length;
        for (var indiceFila = 0; indiceFila < numFilas; indiceFila++) {          
          var valor = resultados.rows.item(indiceFila).valor;
          switch (resultados.rows.item(indiceFila).nombre) {
            case "desconectada":
              oj.gOfflineMode(valor === "si");
              break;
            case "servidor":
              oj.gWSUrl(valor + "/SISVANWS/rest/wls/1.0/");
              oj.servidor(valor);
              break;
            case "modo":
              oj.gModoDependiente(valor === "dependiente");
              break;
            case "configurada":
              oj.gAppConfigurada(valor === "si");
              break;
            case "usuario":
              oj.gUsuario(valor);
              break;             
            case "contrasenia":
              oj.gContrasenia(valor);
              break; 
          }
        }

        if (oj.gAppConfigurada() === true) {
          self.router.configure({
            'login': { label: 'Inicio Sesión', isDefault: true }
          });
        }

        if(oj.gModoDependiente() === false) {
          oj.servidor("Sin servidor");
        } 

        oj.Router.sync();
        self.navDataProvider(new ArrayDataProvider([], { keyAttributes: 'id' }));
      }

      function manejarErrores(error) {
        alert("Error durante la inicialización, intente reiniciando la aplicación, si la falla persiste contecte al soporte técnico");
        console.log("Error en la base de datos: " + error.message);
      }

      oj.gValidadorContrasenia = ko.observableArray([
        new AsyncRegExpValidator({
          pattern: '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}',
          messageDetail: "Mejore la contraseña"
        })
      ]);

      oj.gValidadorDireccionServidor = ko.observableArray([
        new AsyncRegExpValidator({
          pattern: "^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$",
          messageDetail: "Direccion inválida"
        })
      ]);
      
      oj.gCancelarConfig = function() {
        oj.contrasenia("");
        oj.nuevaContrasenia("");
        oj.confContrasenia("");
        document.getElementById("dialogoConfiguracion").close();
      };

      self.actualizarServidor = function () {
        var peticionValidarServidor = new XMLHttpRequest();
        peticionValidarServidor.open("GET", oj.servidor() + "/SISVANWS/rest/wls/1.0/obtenerEscuelas");
        peticionValidarServidor.onreadystatechange = function () {
          if (this.readyState === 4) {
            if (this.status === 200) {
              oj.gConexionDB().transaction(function (transaccion) {
                transaccion.executeSql("UPDATE parametros SET valor = ? WHERE nombre = 'servidor'",
                  [oj.servidor()], function () {
                    alert("Datos actualizados satisfactoriamente.");
                    oj.gWSUrl(oj.servidor() + "/SISVANWS/rest/wls/1.0/");
                    oj.gCancelarConfig();
                  }, manejarErrores);
              }, function (error) {
                alert("Error durante el cambio de servidor, reinicie la aplicación e intente nuevamente.");
                console.log("Error en la base de datos: " + error.message);
              });
            } else {
              alert("No es posible validar el servidor, favor de contactar al administrador.");
            }
          }
        };
        peticionValidarServidor.send();
      };

      function cambiarContrasenia(transaccion, resultados) {
        if(resultados.rows.length === 0) {
          alert("La contraseña no coincide, favor de revisarla.");
        } else {
          oj.gConexionDB().transaction(function (transaccion) {
            transaccion.executeSql("UPDATE parametros SET valor = ? WHERE nombre = 'contrasenia'",
              [oj.nuevaContrasenia()], function() {
                if(oj.gModoDependiente() === true && oj.servidor() !== "" && oj.servidor() !== undefined) {
                  self.actualizarServidor();
                } else {
                  alert("Datos actualizados satisfactoriamente.");
                  oj.gCancelarConfig();
                }                
                oj.gContrasenia(oj.contrasenia());
              }, manejarErrores);
          }, function (error) {
            alert("Error durante el cambio de contraseña, reinicie la aplicación e intente nuevamente.");
            console.log("Error en la base de datos: " + error.message);
          });
        }
      }

      oj.gCambiarParametros = function() {
        var servidor = document.getElementById("servidor");
        var contraseniaActual = document.getElementById("contrasenia");
        var nuevaContrasenia = document.getElementById("nueva-contrasenia");
        var confContrasenia = document.getElementById("confirmar-contrasenia");        

        if(oj.gModoDependiente() === true) {
          if (oj.servidor() !== "" && oj.servidor() !== undefined) {
            servidor.validate();
            if (servidor.valid === 'invalidShown') {
              return;
            }
          }
        } if (oj.contrasenia() !== "" && oj.contrasenia() !== undefined) {
          console.log(oj.contrasenia());
          contraseniaActual.validate();
          nuevaContrasenia.validate();
          confContrasenia.validate();

          if (contraseniaActual === 'invalidShown' || nuevaContrasenia.valid === 'invalidShown' || confContrasenia.valid === 'invalidShown') {
            return;
          }

          if (oj.nuevaContrasenia() !== oj.confContrasenia()) {
            alert("La contrasenia nueva y la confirmación deben coincidir.");
            return;
          }

          oj.gConexionDB().transaction(function (transaccion) {
            transaccion.executeSql("SELECT nombre from parametros WHERE nombre = 'contrasenia' AND valor = ?",
              [oj.contrasenia()], cambiarContrasenia, manejarErrores);
          }, function (error) {
            alert("Error durante el cambio de contraseña, reinicie la aplicación e intente nuevamente.");
            console.log("Error en la base de datos: " + error.message);
          });
        } else if(oj.gModoDependiente() === true && oj.servidor() !== "" && oj.servidor() !== undefined) {
          self.actualizarServidor();
        } else {
          alert("Nada que actualizar");
          oj.gCancelarConfig();
        }
      };

      document.addEventListener("deviceready", function () {
        ko.applyBindings(self, document.getElementById("dialogoConfiguracion"));
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

      // Router setup
      self.router = Router.rootInstance;        

      self.router.configure({
        'config': { label: 'Bienvenido', isDefault: true }
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
            document.getElementById('dialogoCargando').close();
          };

          writer.seek(0);
          writer.write(binario);

        }, manejarErrores);
      }

      oj.gObtenerArchivo = function(funcion, parametros, nombre) {
        cordova.exec(function(binario) {
          oj.gGuardarArchivos(nombre, binario);
        }, function(error) {
          alert("Error durante el procesamiento del archivo.");
          console.log(error);
          document.getElementById('dialogoCargando').close();
        }, "ProcesadorArchivos", funcion, parametros);
      };

      oj.gAbrirConfig = function() {
        document.getElementById('dialogoConfiguracion').open();
      };

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
              var componentes = fechaActual.toLocaleString("es-MX", {timeZone: "America/Mexico_City"}).split(" ");
              var subComponentes = componentes[0].split("/");
              var fechaRegistro = subComponentes[2] + subComponentes[1] + subComponentes[0] + "-" + componentes[1].replace(/:/g, "");
              var nombreFinal = nombre.split(".")[0] + "-" + fechaRegistro + "." + nombre.split(".")[1];
              directorio.getFile(nombreFinal, {
                create: true,
                exclusive: false
              },
                function (direccionArchivo) {
                  escribirArchivo(direccionArchivo, binario);
                }, manejarErrores);
            }, manejarErrores);
        }, manejarErrores);
      };

      //self.navDataProvider = new ArrayDataProvider(navData, { keyAttributes: 'id' });

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
