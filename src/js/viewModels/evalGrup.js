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
  'ojs/ojarraydataprovider', 'ojs/ojchart', 'ojs/ojswitcher', 'ojs/ojdialog', 'ojs/ojdatetimepicker'],
  function (oj, ko, app, moduleUtils, accUtils) {

    function ModeloEvaluacionesGrupales() {
      var self = this;
      self.origenDatosEscuelas = ko.observable();
      self.escuelaSeleccionada = ko.observable();
      self.grupoSeleccionado = ko.observable();
      self.evaluacionSeleccionada = ko.observable("eval-escuela");
      self.porcentajesEscuelas = ko.observable();
      self.porcentajesGrupos = ko.observable();
      self.origenDatosGrupos = ko.observable();
      self.tipoEvalSeleccionada = ko.observable("imc");
      self.tituloGraficoEscolar = ko.observable();
      self.valorDesde = ko.observable();
      self.valorHasta = ko.observable();
      var todosLosGrupos = {};
      var nombreEscuelaSeleccionada = "";
      var etiquetaGrupoSeleccionado;
      self.escuelas = [];
      self.estiloGraficos = ko.observable({"fontSize":"15px"});
      self.tituloGraficoEscolar = ko.observable();
      self.tituloGraficoGrupal = ko.observable();
      self.sinGrupos = ko.observable(false);

      self.obtenerLasEscuelas = function () {
        var peticionListaEscuelas = new XMLHttpRequest();
        peticionListaEscuelas.open("GET", oj.gWSUrl() + "obtenerEscuelas", false);
        peticionListaEscuelas.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    var respuestaJSON = JSON.parse(this.responseText);
                    if (respuestaJSON.hasOwnProperty("error")) {
                        if (respuestaJSON.error === "No hay datos.") {
                            alert('No se encontro ninguna escuela');
                        } else {
                          alert("Error en el servidor, favor de comunicarse con el administrador.");
                        }
                    } else {
                      self.escuelas = respuestaJSON.escuelas;
                      self.origenDatosEscuelas(new oj.ArrayDataProvider(respuestaJSON.escuelas));
                    }
                } else {
                  alert("Error en el servidor, favor de comunicarse con el administrador.");
                }
            }
        };

        peticionListaEscuelas.send();
      };

      self.tituloEscuela = ko.pureComputed(function () {
        return {
          title: "Escuela Primaria: " + nombreEscuelaSeleccionada
        };
      });

      self.tituloGrupo = ko.pureComputed(function () {
        return {
          title: "Escuela Primaria: " + nombreEscuelaSeleccionada + "\nGrupo: " + etiquetaGrupoSeleccionado
        };
      });

      self.obtenerTodosLosGrupos = function () {
        var peticionGrupos = new XMLHttpRequest();
        peticionGrupos.open("GET", oj.gWSUrl() + "grupos/obtenerTodosLosGrupos/" + self.valorHasta(), false);
        peticionGrupos.onreadystatechange = function () {
          if (this.readyState === 4) {
            if (this.status === 200) {
              todosLosGrupos = JSON.parse(this.responseText);
              self.origenDatosGrupos(new oj.ArrayDataProvider(todosLosGrupos[self.escuelas[0].value]));
            }
          }
        };
        peticionGrupos.send();
      };


      self.funcionTecho = function (desde) {
        var fecha = new Date(desde() + "T12:00:00");
        var fechaHasta;

        if (fecha.getMonth() >= 7 && fecha.getMonth() <= 11) {
          var anio = fecha.getFullYear() + 1;
          fechaHasta = anio + '-' + '07-31';
        } else {
          fechaHasta = fecha.getFullYear() + '-' + '07-31';
        }

        self.valorHasta(fechaHasta);
        return fechaHasta;
      };

      self.obtenerPorcentajesEscolares = function (idEscuela, diagnostico) {
        var servicio = "escolares/obtenerPorcentajesEscuela/?id_escuela=" + idEscuela +
          "&desde=" + self.valorDesde() +
          "&hasta=" + self.valorHasta() +
          "&diagnostico=" + diagnostico;
        var peticionPorcentajesEscolares = new XMLHttpRequest();
        peticionPorcentajesEscolares.open("GET", oj.gWSUrl() + servicio, false);
        peticionPorcentajesEscolares.onreadystatechange = function () {
          if (this.readyState === 4) {
            if (this.status === 200) {
              var respuestaJSON = JSON.parse(this.responseText);
              if (respuestaJSON.hasOwnProperty("error")) {
                if (respuestaJSON.error === "No hay datos.") {
                  self.porcentajesEscuelas(new oj.ArrayDataProvider([{ NoData: "" }]));
                } else {
                  alert('No se encontro ningun dato, contacte al administrador.');
                }
              } else {
                self.porcentajesEscuelas(new oj.ArrayDataProvider(respuestaJSON.datos));
                self.tituloGraficoEscolar("PRIMARIA " + nombreEscuelaSeleccionada);
              }
            } else {
              alert('No se encontro ningun dato, contacte al administrador.');
            }
          }
        };
        peticionPorcentajesEscolares.send();
      };

      self.obtenerPorcentajesGrupales = function (idGrupo, diagnostico) {
        var servicio = "escolares/obtenerPorcentajesGrupo/?id_grupo=" + idGrupo +
          "&desde=" + self.valorDesde() +
          "&hasta=" + self.valorHasta() +
          "&diagnostico=" + diagnostico;

        var peticionPorcentajesGrupos = new XMLHttpRequest();
        peticionPorcentajesGrupos.open("GET", oj.gWSUrl() + servicio, false);
        peticionPorcentajesGrupos.onreadystatechange = function () {
          if (this.readyState === 4) {
            if (this.status === 200) {
              var respuestaJSON = JSON.parse(this.responseText);
              if (respuestaJSON.hasOwnProperty("error")) {
                if (respuestaJSON.error === "No hay datos.") {
                  self.porcentajesGrupos(new oj.ArrayDataProvider([{ NoData: "" }]));
                } else {
                  alert("Error en el servidor, favor de comunicarse con el administrador.");
                }
              } else {
                self.porcentajesGrupos(new oj.ArrayDataProvider(respuestaJSON.datos));
                self.tituloGraficoGrupal("PRIMARIA " + nombreEscuelaSeleccionada + " GRUPO " + etiquetaGrupoSeleccionado);
              }
            } else {
              alert("Error en el servidor, favor de comunicarse con el administrador.");
            }
          }
        };
        peticionPorcentajesGrupos.send();
      };   

      self.obtenerRangos = function () {
        var peticionRangos = new XMLHttpRequest();
        peticionRangos.open("GET", oj.gWSUrl() + "obtenerRangos", false);
        peticionRangos.onreadystatechange = function () {
          if (this.readyState === 4) {
            if (this.status === 200) {
              var respuestaJSON = JSON.parse(this.responseText);
              var desde = respuestaJSON.rangos[0].desde;
              var hasta = respuestaJSON.rangos[0].hasta;

              if (desde === "" || hasta === "") {
                var fechaActual = new Date();
                if (fechaActual.getMonth() >= 7 && fechaActual.getMonth() <= 11) {
                  self.valorDesde(fechaActual.getFullYear() + "-08-01");
                  self.valorHasta((fechaActual.getFullYear() + 1) + "-07-31");
                } else {
                  self.valorDesde((fechaActual.getFullYear() - 1) + "-08-01");
                  self.valorHasta(fechaActual.getFullYear() + "-07-31");
                }
              } else {
                self.valorDesde(desde);
                self.valorHasta(hasta);
              }
              
              self.obtenerLasEscuelas();
              self.obtenerTodosLosGrupos();
              nombreEscuelaSeleccionada = self.escuelas[0].label;
              self.obtenerPorcentajesEscolares(self.escuelas[0].value, "imc");
              etiquetaGrupoSeleccionado = todosLosGrupos[self.escuelas[0].value][0].label;
              self.obtenerPorcentajesGrupales(todosLosGrupos[self.escuelas[0].value][0].value, "imc");
              //self.obtenerHistoricoEscolar(todosLosGrupos[self.escuelas[0].value][0].value, "imc");
            } else {
              alert("Error cargando ultimas mediciones, favor de contactar al administrador.")
            }
          }
        };

        peticionRangos.send();
      };

      self.obtenerRangos();      

      self.actualizarGraficos = function (event) {
        self.obtenerPorcentajesEscolares(self.escuelaSeleccionada(), self.tipoEvalSeleccionada());
        self.obtenerPorcentajesGrupales(self.grupoSeleccionado(), self.tipoEvalSeleccionada());
        self.cerrarDialogo();
        //self.obtenerHistoricoEscolar(escuelaSeleccionada, diagnosticoSeleccionado);
      };

      self.cambioEscuela = event => {
        nombreEscuelaSeleccionada = event.target.innerText;
        escuelaSeleccionada = event.target.value;
        grupoSeleccionado = "";
        if (todosLosGrupos.hasOwnProperty(event.target.value)) {
          self.origenDatosGrupos(new oj.ArrayDataProvider(todosLosGrupos[event.target.value]));
          self.sinGrupos(false);
        } else {
          self.origenDatosGrupos(new oj.ArrayDataProvider([{"value":-1,"label":"Sin grupos"}]));
          self.sinGrupos(true);
        }
        self.grupoSeleccionado(null);
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
        createPDFRequest.open('POST', oj.gWSUrl + "generarImagen", true);
        createPDFRequest.responseType = "arraybuffer";
        createPDFRequest.onreadystatechange = function () {
          if (this.readyState == 4) {
            if (this.status == 200) {
              var link = document.createElement("a");
              var arrayBuffer = this.response;
              var blob = new Blob([this.response], { type: "image/png" });
              var pdfUrl = URL.createObjectURL(blob);
              link.href = pdfUrl;
              link.style = "visibility:hidden";
              link.download = "Reporte.png";
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

      self.ingresarParametros = function() {
        document.getElementById("dialogo-parametros").open();
      };

      self.cerrarDialogo = function() {
        document.getElementById("dialogo-parametros").close();
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
    return ModeloEvaluacionesGrupales;
  }
);
