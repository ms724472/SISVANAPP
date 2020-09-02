/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils', 'ojs/ojselectcombobox',
  'ojs/ojarraydataprovider', 'ojs/ojchart', 'ojs/ojswitcher'],
  function (oj, ko, app, moduleUtils, accUtils) {

    function EvaluacionesGrupalesVistaModelo() {
      var self = this;
      self.origenDatosEscuelas = ko.observable();
      self.escuelaSeleccionada = ko.observable();
      self.grupoSeleccionado = ko.observable();
      self.evaluacionSeleccionada = ko.observable("eval-escuela");
      self.porcentajesEscuelas = ko.observable();
      self.porcentajesGrupos = ko.observable();
      self.origenDatosGrupos = ko.observable();
      self.origenDatosGrupo1 = ko.observable();
      self.origenDatosGrupo2 = ko.observable();
      self.origenDatosGrupo3 = ko.observable();
      self.origenDatosGrupo4 = ko.observable();
      self.origenDatosGrupo5 = ko.observable();
      self.origenDatosGrupo6 = ko.observable();

      $.ajax({
        type: "GET",
        contentType: "text/plain; charset=utf-8",
        url: "http://sisvan-iteso.online/SISVANWS/rest/wls/1.0/obtenerEscuelas",
        dataType: "text",
        async: false,
        success: function (data) {
          json = $.parseJSON(data);
          if (json.hasOwnProperty("error")) {
            alert('No se encontro ninguna escuela');
            return;
          } else {
            self.origenDatosEscuelas(new oj.ArrayDataProvider(json.escuelas));
          }
        }
      }).fail(function () {
        alert("Error en el servidor, favor de comunicarse con el administrador.");
        return;
      });

      self.obtenerPorcentajesGrupales = function (idGrupo) {
        $.ajax({
          type: "GET",
          contentType: "text/plain; charset=utf-8",
          url: "http://sisvan-iteso.online/SISVANWS/rest/wls/1.0/escolares/obtenerPorcentajesGrupo/" + idGrupo,
          dataType: "text",
          async: false,
          success: function (data) {
            json = $.parseJSON(data);
            if (json.hasOwnProperty("error")) {
              alert('No se encontro ningun dato, contacte al administrador.');
              return;
            } else {
              self.porcentajesGrupos(new oj.ArrayDataProvider(json.datos));
            }
          }
        }).fail(function () {
          alert("Error en el servidor, favor de comunicarse con el administrador.");
          return;
        });
      };

      $.ajax({
        type: "GET",
        contentType: "text/plain; charset=utf-8",
        url: "http://sisvan-iteso.online/SISVANWS/rest/wls/1.0/escuelas/obtenerGrupos/1",
        dataType: "text",
        async: false,
        success: function (data) {
          json = $.parseJSON(data);
          if (json.hasOwnProperty("error")) {
            alert('No se encontro ningun grupo');
            return;
          } else {
            self.origenDatosGrupos(new oj.ArrayDataProvider(json.grupos));
            self.origenDatosGrupo1(new oj.ArrayDataProvider(json.grupos));
            self.obtenerPorcentajesGrupales(1);
          }
        }
      }).fail(function (data, xhr) {
        console.log(data);
        alert("Error en el servidor, favor de comunicarse con el administrador.");
        return;
      });

      $.ajax({
        type: "GET",
        contentType: "text/plain; charset=utf-8",
        url: "http://sisvan-iteso.online/SISVANWS/rest/wls/1.0/escuelas/obtenerGrupos/2",
        dataType: "text",
        async: false,
        success: function (data) {
          json = $.parseJSON(data);
          if (json.hasOwnProperty("error")) {
            alert('No se encontro ningun grupo');
            return;
          } else {
            self.origenDatosGrupo2(new oj.ArrayDataProvider(json.grupos));
          }
        }
      }).fail(function () {
        alert("Error en el servidor, favor de comunicarse con el administrador.");
        return;
      });

      $.ajax({
        type: "GET",
        contentType: "text/plain; charset=utf-8",
        url: "http://sisvan-iteso.online/SISVANWS/rest/wls/1.0/escuelas/obtenerGrupos/3",
        dataType: "text",
        async: false,
        success: function (data) {
          json = $.parseJSON(data);
          if (json.hasOwnProperty("error")) {
            alert('No se encontro ningun grupo');
            return;
          } else {
            self.origenDatosGrupo3(new oj.ArrayDataProvider(json.grupos));
          }
        }
      }).fail(function () {
        alert("Error en el servidor, favor de comunicarse con el administrador.");
        return;
      });

      $.ajax({
        type: "GET",
        contentType: "text/plain; charset=utf-8",
        url: "http://sisvan-iteso.online/SISVANWS/rest/wls/1.0/escuelas/obtenerGrupos/4",
        dataType: "text",
        async: false,
        success: function (data) {
          json = $.parseJSON(data);
          if (json.hasOwnProperty("error")) {
            alert('No se encontro ningun grupo');
            return;
          } else {
            self.origenDatosGrupo4(new oj.ArrayDataProvider(json.grupos));
          }
        }
      }).fail(function () {
        alert("Error en el servidor, favor de comunicarse con el administrador.");
        return;
      });

      $.ajax({
        type: "GET",
        contentType: "text/plain; charset=utf-8",
        url: "http://sisvan-iteso.online/SISVANWS/rest/wls/1.0/escuelas/obtenerGrupos/5",
        dataType: "text",
        async: false,
        success: function (data) {
          json = $.parseJSON(data);
          if (json.hasOwnProperty("error")) {
            alert('No se encontro ningun grupo');
            return;
          } else {
            self.origenDatosGrupo5(new oj.ArrayDataProvider(json.grupos));
          }
        }
      }).fail(function () {
        alert("Error en el servidor, favor de comunicarse con el administrador.");
        return;
      });

      $.ajax({
        type: "GET",
        contentType: "text/plain; charset=utf-8",
        url: "http://sisvan-iteso.online/SISVANWS/rest/wls/1.0/escuelas/obtenerGrupos/6",
        dataType: "text",
        async: false,
        success: function (data) {
          json = $.parseJSON(data);
          if (json.hasOwnProperty("error")) {
            alert('No se encontro ningun grupo');
            return;
          } else {
            self.origenDatosGrupo6(new oj.ArrayDataProvider(json.grupos));
          }
        }
      }).fail(function () {
        alert("Error en el servidor, favor de comunicarse con el administrador.");
        return;
      });

      self.cambioGrupo = event => {
        self.generarGraficaGrupo();
      };

      self.cambioEscuela = event => {
        if (self.evaluacionSeleccionada() === "eval-grupal") {
          switch (event.detail.value) {
            case "1":
              self.origenDatosGrupos(self.origenDatosGrupo1());
              break;
            case "2":
              self.origenDatosGrupos(self.origenDatosGrupo2());
              break;
            case "3":
              self.origenDatosGrupos(self.origenDatosGrupo3());
              break;
            case "4":
              self.origenDatosGrupos(self.origenDatosGrupo4());
              break;
            case "5":
              self.origenDatosGrupos(self.origenDatosGrupo5());
              break;
            case "6":
              self.origenDatosGrupos(self.origenDatosGrupo6());
              break;
          }
        } else {
          self.generarGraficaEscuela();
        }
      };

      self.generarGraficaEscuela = function () {
        self.obtenerPorcentajesEscolares(document.getElementById('seleccionadorEscuela').value);
      };

      self.generarGraficaGrupo = function () {
        self.obtenerPorcentajesGrupales(document.getElementById('seleccionadorGrupo').value);
      };

      // Header Config
      self.headerConfig = ko.observable({ 'view': [], 'viewModel': null });
      moduleUtils.createView({ 'viewPath': 'views/header.html' }).then(function (view) {
        self.headerConfig({ 'view': view, 'viewModel': new app.getHeaderModel() })
      })

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
        accUtils.announce('Pagina de evaluaciones grupales lista.');
        document.title = "Evaluaciones grupales";
        // Implement further logic if needed
      };

      self.descargarImagen = function () {
        var createPDFRequest = new XMLHttpRequest();
        createPDFRequest.open('POST', "http://sisvan-iteso.online/SISVANWS/rest/wls/1.0/generarPDF", true);
        createPDFRequest.responseType = "arraybuffer";
        createPDFRequest.onreadystatechange = function () {
          if (this.readyState == 4) {
            if (this.status == 200) {
              var link = document.createElement("a");
              var arrayBuffer = this.response;
              var blob = new Blob([arrayBuffer], { type: "application/pdf" });
              var pdfUrl = URL.createObjectURL(blob);
              link.href = pdfUrl;
              link.style = "visibility:hidden";
              link.download = "Reporte.pdf";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } else {
              alert("Error en el servidor, favor de comunicarse con el administrador.");
            }
          }
        }
        var idSVG = self.evaluacionSeleccionada() === "eval-grupal" ? 2 : 0;
        var alto = document.getElementsByTagName("svg")[idSVG].clientHeight;
        var ancho = document.getElementsByTagName("svg")[idSVG].clientWidth;
        var svg = document.getElementsByTagName('svg')[idSVG].outerHTML;
        var cuerpoPeticion = { alto: alto, ancho: ancho, svg: svg, tipo: self.evaluacionSeleccionada() === "eval-grupal" ? "grupo" : "escuela" };
        createPDFRequest.send(JSON.stringify(cuerpoPeticion));
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

      self.obtenerPorcentajesEscolares = function (idEscuela) {
        $.ajax({
          type: "GET",
          contentType: "text/plain; charset=utf-8",
          url: "http://sisvan-iteso.online/SISVANWS/rest/wls/1.0/escolares/obtenerPorcentajesEscuela/" + idEscuela,
          dataType: "text",
          async: false,
          success: function (data) {
            json = $.parseJSON(data);
            if (json.hasOwnProperty("error")) {
              alert('No se encontro ningun dato, contacte al administrador.');
              return;
            } else {
              self.porcentajesEscuelas(new oj.ArrayDataProvider(json.datos));
            }
          }
        }).fail(function () {
          alert("Error en el servidor, favor de comunicarse con el administrador.");
          return;
        });
      };

      self.obtenerPorcentajesEscolares(1);
    }

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return EvaluacionesGrupalesVistaModelo;
  }
);
