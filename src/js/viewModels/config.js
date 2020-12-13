/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/*
 * Your about ViewModel code goes here
 */
define(['knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils', 'ojs/ojasyncvalidator-regexp', 'ojs/ojarraydataprovider', 'ojs/ojselectcombobox', 
'ojs/ojinputtext', 'ojs/ojprogress', 'ojs/ojdialog'],
 function(ko, app, moduleUtils, accUtils, AsyncRegExpValidator, ArrayDataProvider) {

    function ModeloAsistente() {
      var self = this;
      self.modoApp = ko.observable("dependiente");  
      self.servidor = ko.observable("");   
      self.usuario = ko.observable("");
      self.contrasenia = ko.observable("");
      self.confContrasenia = ko.observable("");  

      // Header Config
      self.headerConfig = ko.observable({'view':[], 'viewModel':null});
      moduleUtils.createView({'viewPath':'views/header.html'}).then(function(view) {
        self.headerConfig({'view':view, 'viewModel':new app.getHeaderModel()})
      })    

      self.validadorEmail = ko.observableArray([
        new AsyncRegExpValidator({
          pattern: "[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*",
          label: "Password",
          messageSummary: "{label} too Weak",
          messageDetail: "Introduce un correo electrónico correcto."
        })
      ]);

      self.validadorContrasenia = ko.observableArray([
        new AsyncRegExpValidator({
          pattern: '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}',
          messageDetail: "Mejore la contraseña"
        })
      ]);

      self.validadorDireccionServidor = ko.observableArray([
        new AsyncRegExpValidator({
          pattern: "^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$",
          messageDetail: "Direccion inválida"
        })
      ]);

      self.redireccionar = function () {
        oj.gAppConfigurada(true);
        
        app.router = oj.Router.rootInstance;

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
          app.router.configure({
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
          app.router.configure({
            'evalGrup': { label: 'Evaluaciones colectivas', isDefault: true },
            'evalIndv': { label: 'Evaluación individual' },
            'estUtils': { label: 'Estadísticas OMS' }
          });
        }

        app.navDataProvider(new ArrayDataProvider(navData, { keyAttributes: 'id' }));  
        oj.Router.sync();
      }

      self.actualizarParametrosBD = function(parametros, valores) {
        parametros.some(function (parametro) {
          if(falla === true) {
            return true;
          }

          var consultaActualizarParametros = "UPDATE parametros SET valor = ? WHERE nombre = ?";

          oj.gConexionDB().transaction(function (transaccion) {
            transaccion.executeSql(consultaActualizarParametros,
              [valores[parametro], parametro], function (transaccion, resultados) {
                if(parametro === "contrasenia") {
                  alert("Aplicación configurada exitosamente.");
                  document.getElementById("dialogoCargando").close();
                  if(self.modoApp() === "dependiente") {                    
                    oj.gWSUrl(self.servidor() + "/SISVANWS/rest/wls/1.0/");
                    oj.gOfflineMode(false);
                    oj.gModoDependiente(true);
                  } else {
                    oj.gOfflineMode(true);
                    oj.gModoDependiente(false);
                  }                  
                  document.getElementById("formulario-config").style.display = "none";
                  self.redireccionar();
                }
               }, function (error) {
                falla = true;
                alert("Error en la configuracion, borrer los datos de la aplicación y reintente nuevamente.");
                console.log("Error en la base de datos: " + error.message);
              });
          }, function (error) {
            falla = true;
            alert("Error durante la configuracion, por favor borre los datos de almacenamiento y vuelva a intentar.");
            console.log("Error en la base de datos: " + error.message);
          });
        });
      }

      self.completarInstalacion = function() {
        var parametros;
        var valores;

        var campoUsuario = document.getElementById("usuario");
        var campoContrasenia = document.getElementById("contrasenia");
        var campoConfContrasenia = document.getElementById("confContrasenia");        

        campoUsuario.validate();
        campoContrasenia.validate();
        campoConfContrasenia.validate();

        if(campoUsuario.valid === 'invalidShown') {
          alert("Proporciona un correo electrónico válido.");
          return;
        }
        
        if(campoContrasenia.valid === 'invalidShown') {
          alert("Favor de corregir la contraseña.");
          return;
        }

        if(self.contrasenia() !== self.confContrasenia()) {
          alert("El campo de contraseña y la confirmación deben coincidir.");
          return;
        }

        if (self.modoApp() === "dependiente") {
          var campoServidor = document.getElementById("servidor");
          campoServidor.validate();
          if (campoServidor.valid === 'invalidShown' || self.servidor() === "" || self.servidor() === undefined) {
            alert("Proporcione una dirección válida del servidor");
            return;
          }

          document.getElementById("dialogoCargando").open();

          var peticionValidarServidor = new XMLHttpRequest();
          peticionValidarServidor.open("GET", self.servidor() + "/SISVANWS/rest/wls/1.0/obtenerEscuelas");
          peticionValidarServidor.onreadystatechange = function () {
            if (this.readyState === 4) {
              if (this.status === 200) {
                parametros = ["configurada", "modo", "desconectada", "usuario", "contrasenia", "servidor"];
                valores = {
                  configurada: "si",
                  modo: "dependiente",
                  desconectada: "no",
                  usuario: self.usuario(),
                  contrasenia: self.contrasenia(),
                  servidor: self.servidor()
                };  
                self.actualizarParametrosBD(parametros, valores);
              } else {
                document.getElementById("dialogoCargando").close();
                alert("Error durante la validación del servidor, favor de contactar al administrador.")
              }
            }
          };
          peticionValidarServidor.send();
        } else {
          document.getElementById("dialogoCargando").open();
          var falla = false;
          parametros = ["configurada", "modo", "desconectada", "usuario", "contrasenia"];
          valores = {
            configurada: "si",
            modo: "independiente",
            desconectada: "si",
            usuario: self.usuario(),
            contrasenia: self.contrasenia()
          };          
          self.actualizarParametrosBD(parametros, valores);
        }        
      };

      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      self.connected = function() {
        accUtils.announce('About page loaded.');
        document.title = "About";
        // Implement further logic if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function() {
        // Implement if needed
      };
    }

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return ModeloAsistente;
  }
);
