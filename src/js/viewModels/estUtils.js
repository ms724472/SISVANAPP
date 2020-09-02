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
'ojs/ojdatetimepicker', 'ojs/ojinputnumber', 'ojs/ojinputtext', 'ojs/ojcollapsible',
  'ojs/ojarraydataprovider', 'ojs/ojchart', 'ojs/ojaccordion'],
  function (ko, app, moduleUtils, accUtils) {

    function CustomerViewModel() {
      var self = this;

      // Header Config
      self.headerConfig = ko.observable({ 'view': [], 'viewModel': null });
      moduleUtils.createView({ 'viewPath': 'views/header.html' }).then(function (view) {
        self.headerConfig({ 'view': view, 'viewModel': new app.getHeaderModel() })
      })

      self.origenDatosZNinas = ko.observable();
      self.origenDatosZNinos = ko.observable();
      self.orientationValue = ko.observable();

      function ChartModel() {
        /* toggle button variables */
        this.orientationValue = ko.observable('vertical');
        $.ajax({
          type: "GET",
          contentType: "text/plain; charset=utf-8",
          url: "http://sisvan-iteso.online/SISVANWS/rest/wls/1.0/estadisticas/obtenerPuntajesZMasa/Femenino",
          dataType: "text",
          async: false,
          success: function (data) {
            json = $.parseJSON(data);
            if (json.hasOwnProperty("error") && json.error !== "No hay datos.") {
              alert('Error de autenticación, por favor revisa tus datos.');
              return;
            } else {
              self.origenDatosZNinas(new oj.ArrayDataProvider(json.mediciones, { keyAttributes: 'id' }));
            }
          }
        }).fail(function () {
          alert("Error en el servidor, favor de comunicarse con el administrador.");
          return;
        });

        $.ajax({
          type: "GET",
          contentType: "text/plain; charset=utf-8",
          url: "http://sisvan-iteso.online/SISVANWS/rest/wls/1.0/estadisticas/obtenerPuntajesZMasa/Masculino",
          dataType: "text",
          async: false,
          success: function (data) {
            json = $.parseJSON(data);
            if (json.hasOwnProperty("error") && json.error !== "No hay datos.") {
              alert('Error en el servidor, favor de comunicarse con el administrador.');
              return;
            } else {
              self.origenDatosZNinos(new oj.ArrayDataProvider(json.mediciones, { keyAttributes: 'id' }));
            }
          }
        }).fail(function () {
          alert("Error en el servidor, favor de comunicarse con el administrador.");
          return;
        });
      }

      var chartModel = new ChartModel();

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
        accUtils.announce('Customers page loaded.');
        document.title = "Customers";
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
