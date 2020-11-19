/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/*
 * Your customer ViewModel code goes here
 */
define(['knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils', 
'ojs/ojarraydataprovider', 'ojs/ojdatetimepicker', 'ojs/ojinputnumber', 'ojs/ojinputtext',
'ojs/ojcollapsible', 'ojs/ojchart', 'ojs/ojaccordion', 'ojs/ojselectcombobox'],
  function (ko, app, moduleUtils, accUtils, ArrayDataProvider) {

    function CustomerViewModel() {
      var self = this;
      var db = null;
      var tipos = [
        { value: "peso", label: "Peso" },
        { value: "talla", label: "Talla" },
        { value: "imc", label: "IMC" }
      ];

      // Header Config
      self.headerConfig = ko.observable({ 'view': [], 'viewModel': null });
      moduleUtils.createView({ 'viewPath': 'views/header.html' }).then(function (view) {
        self.headerConfig({ 'view': view, 'viewModel': new app.getHeaderModel() })
      })

      self.origenDatosZNinas = ko.observable();
      self.origenDatosZNinos = ko.observable();
      self.orientationValue = ko.observable();
      self.orientationValue = ko.observable('vertical');
      self.tipoPuntaje = ko.observable("peso");     
      self.tiposPuntajes = new ArrayDataProvider(tipos, { keyAttributes: "value" });
      
      self.obtenerEstadisticas = function(transaccion, tipo, sexo) {
        var tabla = "percentiles_oms_" + tipo;
        var consultaEstadisticas = "SELECT cast(replace(id_percentil, ?, '') as unsigned) as mes, \n"
          + "sd3, \n"
          + "sd2, \n"
          + "sd1, \n"
          + "sd0, \n"
          + "sd1_neg, \n"
          + "sd2_neg, \n"
          + "sd3_neg FROM \n"
          + tabla + " WHERE id_percentil LIKE('%" + sexo + "%') \n"
          + "ORDER BY mes";
        transaccion.executeSql(consultaEstadisticas, [sexo], function(transaccion, resultados) {
          var estadisticasJSON = [];
          var contador = resultados.rows.length;
          var idEstadistica = 0;
          for (var indice = 0; indice < contador; indice++) {
            var estActual = resultados.rows.item(indice);
            var columnas = Object.keys(estActual);
            var mes;
            for (var subIndice in columnas) {
              var serie = columnas[subIndice];
              if (serie === "mes") {
                mes = estActual[columnas[subIndice]];
                continue;
              }

              var estActualJSON = {};
              estActualJSON.id = idEstadistica;
              estActualJSON.serie = columnas[subIndice];
              estActualJSON.mes = mes;
              estActualJSON.valor = estActual[columnas[subIndice]];
              estadisticasJSON.push(estActualJSON);
              idEstadistica++;
            }
          }

          switch(sexo) {
            case "femenino":
              self.origenDatosZNinos(new ArrayDataProvider(estadisticasJSON, { keyAttributes: 'id' }));
              break;
            case "masculino":
              self.origenDatosZNinas(new ArrayDataProvider(estadisticasJSON, { keyAttributes: 'id' }));
              break;
          }          
        }, function(transaccion, error) {
          alert("Problemas con la aplicación, por favor reiniciala: " + error.code);
        });
      };

      self.actualizarPuntajes = function(event) {
        db.transaction(function(transaccion) {
          self.obtenerEstadisticas(transaccion, self.tipoPuntaje(), "femenino");
          self.obtenerEstadisticas(transaccion, self.tipoPuntaje(), "masculino");
        }, function(error){
            alert("Problemas con la aplicación, por favor reiniciala");
        });
      }

      document.addEventListener("deviceready", function(){  
          db = window.sqlitePlugin.openDatabase({name: "sve-base-datos.db", location: 'default', createFromLocation: 1});          
          self.actualizarPuntajes();
      }, false);

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
      self.connected = function () {
        accUtils.announce("Estadísticas OMS cargadas.");
        document.title = "Estadísticas OMS";
        // Implement further logic if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function () {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function () {
        // Implement if needed
      };
    }

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return CustomerViewModel;
  }
);
