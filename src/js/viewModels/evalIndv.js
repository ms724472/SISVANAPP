/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/*
 * Your incidents ViewModel code goes here
 */
define(['knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils', 'ojs/ojlistview', 'ojs/ojtable', 'ojs/ojselectcombobox',
  'ojs/ojinputtext', 'ojs/ojaccordion', 'ojs/ojdialog', 'ojs/ojarraydataprovider', 'ojs/ojchart', 'ojs/ojarraytabledatasource',
  'ojs/ojdatetimepicker', 'ojs/ojtimezonedata', 'ojs/ojprogress'],
  function (ko, app, moduleUtils, accUtils) {

    function IncidentsViewModel() {
      var self = this;
      self.datosAlumno = ko.observable();
      self.idAlumno = ko.observable();
      self.medicion1 = ko.observable();
      self.medicion2 = ko.observable();
      self.medicion3 = ko.observable();
      self.medicion4 = ko.observable();
      self.medicion5 = ko.observable();
      self.dataProvider = ko.observable();
      self.datosEstatura = ko.observable();
      self.orientationValue = ko.observable();
      self.origenDatosNombres = ko.observable();
      self.alumnoSeleccionado = ko.observable();
      self.nuevoEscuelaAlumno = ko.observable();
      self.origenDatosEscuelas = ko.observable();
      self.nuevoSexoAlumno = ko.observable();
      self.nuevoGradoAlumno = ko.observable();
      self.nuevoGrupoAlumno = ko.observable();

      function ChartModel() {
        /* toggle button variables */
        this.orientationValue = ko.observable('vertical');
        this.dataProvider = new oj.ArrayDataProvider(JSON.parse(mediciones), { keyAttributes: 'id' });
        this.datosEstatura = new oj.ArrayDataProvider(JSON.parse(mediciones), { keyAttributes: 'id' });
      }

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

      // Header Config
      self.headerConfig = ko.observable({ 'view': [], 'viewModel': null });
      moduleUtils.createView({ 'viewPath': 'views/header.html' }).then(function (view) {
        self.headerConfig({ 'view': view, 'viewModel': new app.getHeaderModel() })
      })

      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.
      self.obtenerInfo = function () {
        $.ajax({
          type: "GET",
          contentType: "text/plain; charset=utf-8",
          url: "http://sisvan-iteso.online/SISVANWS/rest/wls/1.0/alumnos/obtenerDatos/" + self.idAlumno(),
          dataType: "text",
          async: false,
          success: function (data) {
            json = $.parseJSON(data);
            if (json.hasOwnProperty("error") && json.error !== "No hay datos.") {
              alert('Error de autenticación, por favor revisa tus datos.');
              return;
            } else {
              var campos = [];
              var indice = 0;
              for (var llave in json.datos[0]) {
                var campo = {};
                campo["id"] = indice;
                switch (llave) {
                  case "apellido_p":
                    campo["campo"] = "Apellido Paterno";
                    break;
                  case "apellido_m":
                    campo["campo"] = "Apellido Materno";
                    break;
                  case "fecha_nac":
                    campo["campo"] = "Fecha de nacimiento";
                    break;
                  case "letra":
                    campo["campo"] = "Grupo";
                    break;
                  default:
                    campo["campo"] = llave[0].toUpperCase() + llave.slice(1);
                    break;
                }
                campo["valor"] = json.datos[0][llave];
                campos.push(campo);
                indice++;
              }
              self.datosAlumno(new oj.ArrayDataProvider(campos, { keyAttributes: 'id' }));
            }
          }
        }).fail(function () {
          alert("Error en el servidor, favor de comunicarse con el administrador.");
          return;
        });

        $.ajax({
          type: "GET",
          contentType: "text/plain; charset=utf-8",
          url: "http://sisvan-iteso.online/SISVANWS/rest/wls/1.0/alumnos/obtenerMediciones/" + self.idAlumno(),
          dataType: "text",
          async: false,
          success: function (data) {
            json = $.parseJSON(data);
            if (json.hasOwnProperty("error") && json.error !== "No hay datos.") {
              alert('Error de autenticación, por favor revisa tus datos.');
              return;
            } else {
              var numMedicion = 1;
              json.mediciones.forEach(medicion => {
                var campos = [];
                var indice = 0;
                for (var llave in medicion) {
                  if (llave === "id_alumno") {
                    continue;
                  } else if (llave === "fecha") {
                    document.getElementById("tituloMedicion" + numMedicion).innerText = medicion[llave];
                    document.getElementById("medicion" + numMedicion).style.display = "initial";
                    numMedicion++;
                    continue;
                  }
                  var campo = {};
                  campo["id"] = indice;
                  switch (llave) {
                    case "masa":
                      campo["campo"] = "Peso";
                      break;
                    case "imc":
                      campo["campo"] = "Indice de Masa Corporal";
                      break;
                    case "perimetro_cuello":
                      campo["campo"] = "Perimetro del cuello";
                      break;
                    case "pliegue_cuello":
                      campo["campo"] = "Pliegue del cuello";
                      break;
                    default:
                      campo["campo"] = llave[0].toUpperCase() + llave.slice(1);
                      break;
                  }
                  campo["valor"] = medicion[llave];
                  campos.push(campo);
                  indice++;
                }

                switch (numMedicion) {
                  case 2:
                    self.medicion1(new oj.ArrayDataProvider(campos, { keyAttributes: 'id' }));
                    break;
                  case 3:
                    self.medicion2(new oj.ArrayDataProvider(campos, { keyAttributes: 'id' }));
                    break;
                  case 4:
                    self.medicion3(new oj.ArrayDataProvider(campos, { keyAttributes: 'id' }));
                    break;
                  case 5:
                    self.medicion4(new oj.ArrayDataProvider(campos, { keyAttributes: 'id' }));
                    break;
                  case 6:
                    self.medicion5(new oj.ArrayDataProvider(campos, { keyAttributes: 'id' }));
                    break;
                }
              });
            }
          }
        }).fail(function () {
          alert("Error en el servidor, favor de comunicarse con el administrador.");
          return;
        });

        $.ajax({
          type: "GET",
          contentType: "text/plain; charset=utf-8",
          url: "http://sisvan-iteso.online/SISVANWS/rest/wls/1.0/alumnos/obtenerHistoricoMasa/" + self.idAlumno(),
          dataType: "text",
          async: false,
          success: function (data) {
            json = $.parseJSON(data);
            if (json.hasOwnProperty("error") && json.error !== "No hay datos.") {
              alert('Error de autenticación, por favor revisa tus datos.');
              return;
            } else {
              self.dataProvider(new oj.ArrayDataProvider(json.mediciones, { keyAttributes: 'id' }));
            }
          }
        }).fail(function () {
          alert("Error en el servidor, favor de comunicarse con el administrador.");
          return;
        });

        $.ajax({
          type: "GET",
          contentType: "text/plain; charset=utf-8",
          url: "http://sisvan-iteso.online/SISVANWS/rest/wls/1.0/alumnos/obtenerHistoricoEstatura/" + self.idAlumno(),
          dataType: "text",
          async: false,
          success: function (data) {
            json = $.parseJSON(data);
            if (json.hasOwnProperty("error") && json.error !== "No hay datos.") {
              alert('Error de autenticación, por favor revisa tus datos.');
              return;
            } else {
              self.datosEstatura(new oj.ArrayDataProvider(json.mediciones, { keyAttributes: 'id' }));
            }
          }
        }).fail(function () {
          alert("Error en el servidor, favor de comunicarse con el administrador.");
          return;
        });
      };

      self.buscarAlumno = function () {
        document.getElementById('dialogoBuscarAlumno').open();
      };

      self.cancelarBusqueda = function () {
        document.getElementById('dialogoBuscarAlumno').close();
      };

      self.nuevaMedicion = function () {
        if(self.idAlumno() !== undefined && self.idAlumno() !== ""){
          document.getElementById('dialogoNuevaMedicion').open();
        } else {
          alert("Selecciona o crea un alumno para agregar una nueva medición.")
        }
      };

      self.cancelarNuevaMedicion = function () {
        document.getElementById('dialogoNuevaMedicion').close();
      };

      self.encontrarAlumno = function () {
        var nombreAlumno = document.getElementById("nombreABuscar").value;
        var datos = '{"No se encontraron resultados":""}';
        datos = JSON.parse("[" + datos + "]");

        $.ajax({
          type: "GET",
          contentType: "text/plain; charset=utf-8",
          url: "http://sisvan-iteso.online/SISVANWS/rest/wls/1.0/alumnos/buscarPorNombre/" + nombreAlumno,
          dataType: "text",
          async: false,
          success: function (data) {
            json = $.parseJSON(data);
            if (json.hasOwnProperty("error") && json.error !== "No hay datos.") {
              alert('No se encontro ningun alumno');
              return;
            } else if (json.error === "No hay datos.") {
              self.origenDatosNombres(new oj.ArrayDataProvider(datos));
            } else {
              self.origenDatosNombres(new oj.ArrayDataProvider(json.alumnos, { keyAttributes: 'id_alumno' }));
            }
          }
        }).fail(function () {
          alert("Error en el servidor, favor de comunicarse con el administrador.");
          return;
        });
      };

      self.abrirDialogoNuevoAlumno = function() {
        document.getElementById('dialogoNuevoAlumno').open();
      };

      self.cancelarNuevoAlumno = function() {
        document.getElementById('dialogoNuevoAlumno').close();
      }

      self.crearNuevaMedicion = function () {
        document.getElementById('dialogoCargando').open();
        var idAlumno = document.getElementById("num-alumno").value;
        var fecha = document.getElementById("nuevaFMedicion").value;
        var masa = document.getElementById("nuevaMasaMedicion").value;
        var estatura = document.getElementById("nuevaEstaturaMedicion").value;
        var perimetro_cuello = document.getElementById("nuevaPerimetroCuelloMedicion").value;
        var cintura = document.getElementById("nuevaCinturaMedicion").value;
        var triceps = document.getElementById("nuevaTricepsMedicion").value;
        var subEscapula = document.getElementById("nuevaSubescapulaMedicion").value;
        var pliegueCuello = document.getElementById("nuevaPliegueCuelloMedicion").value;
        var bodyRequest = {id_alumno: idAlumno,
            fecha: fecha,
            masa: masa,
            estatura: estatura,
            perimetro_cuello: perimetro_cuello,
            cintura: cintura,
            triceps: triceps,
            subEscapula: subEscapula,
            pliegueCuello: pliegueCuello};

        $.ajax({type: "POST",
            contentType: "text/plain; charset=utf-8",
            url: "http://sisvan-iteso.online/SISVANWS/rest/wls/1.0/alumnos/agregarMedicion",
            dataType: "text",
            data: JSON.stringify(bodyRequest).replace(/]|[[]/g, ''),
            async: false,
            success: function (data) {
                json = $.parseJSON(data);
                if (json.hasOwnProperty("error")) {
                    document.getElementById('dialogoCargando').close();
                    alert('Error, por favor revisa tus datos.');
                    return;
                } else {
                    self.obtenerInfo();
                    document.getElementById('dialogoCargando').close();
                    document.getElementById('dialogoNuevaMedicion').close();
                    document.getElementById('nuevaFMedicion').value = '';
                    document.getElementById('nuevaMasaMedicion').value = '';
                    document.getElementById("nuevaEstaturaMedicion").value = '';
                    alert('Agregado correctamente.');
                }
            }
        }).fail(function () {
            document.getElementById('dialogoCargando').close();
            alert("Error en el servidor, favor de comunicarse con el administrador.");
            return;
        });
    };

      self.crearNuevoAlumno = function () {
        document.getElementById('dialogoCargando').open();
        var idAlumno = document.getElementById("nuevoIdAlumno").value;
        var nombre = document.getElementById("nuevoNombreAlumno").value;
        var apellido_p = document.getElementById("nuevoApellidoPAlumno").value;
        var apellido_m = document.getElementById("nuevoApellidoMAlumno").value;
        var sexo = document.getElementById("nuevoSexoAlumno").value;
        var fecha_nac = document.getElementById("nuevoFNacimientoAlumno").value;

        var bodyRequest = {id_alumno: idAlumno,
            nombre: nombre,
            apellido_p: apellido_p,
            apellido_m: apellido_m,
            sexo: sexo,
            fecha_nac: fecha_nac};
        $.ajax({type: "POST",
            contentType: "text/plain; charset=utf-8",
            url: "http://sisvan-iteso.online/SISVANWS/rest/wls/1.0/alumnos/agregarAlumno",
            dataType: "text",
            data: JSON.stringify(bodyRequest).replace(/]|[[]/g, ''),
            async: false,
            success: function (data) {
                json = $.parseJSON(data);
                if (json.hasOwnProperty("error")) {
                    document.getElementById('dialogoCargando').close();
                    alert('Error, por favor revisa tus datos.');
                    return;
                } else {
                    document.getElementById("num-alumno").value = idAlumno;
                    self.obtenerInfo();
                    document.getElementById('dialogoCargando').close();
                    document.getElementById('dialogoNuevoAlumno').close();
                    document.getElementById("nuevoIdAlumno").value = '';
                    document.getElementById("nuevoNombreAlumno").value = '';
                    document.getElementById("nuevoApellidoPAlumno").value = '';
                    document.getElementById("nuevoApellidoMAlumno").value = '';
                    document.getElementById("nuevoSexoAlumno").value = 'Femenino';
                    document.getElementById("nuevoFNacimientoAlumno").value = '';
                    documet.getElementById("nuevoEscuelaAlumno").value = '';
                    document.getElementById("nuevoGradoAlumno").value = '';
                    document.getElementById("nuevoGrupoAlumno").value = '';
                    alert('Agregado correctamente.');
                }
            }
        }).fail(function () {
            document.getElementById('dialogoCargando').close();
            alert("Error en el servidor, favor de comunicarse con el administrador.");
            return;
        });
    };

      self.seleccionarAlumno = function () {
        var datos = '{"No se encontraron resultados":""}';
        datos = JSON.parse("[" + datos + "]");
        document.getElementById('num-alumno').value = self.alumnoSeleccionado();
        document.getElementById('nombreABuscar').value = '';
        self.origenDatosNombres(new oj.ArrayTableDataSource(datos));
        document.getElementById('dialogoBuscarAlumno').close();
      };

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      self.connected = function () {
        accUtils.announce('Incidents page loaded.');
        document.title = "Incidents";
        // Implement further logic if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function () {
        // Implement if needed
      };

      self.obtenerMediciones = function () {
        self.obtenerInfo();
      };

      self.close = function (event) {
        document.getElementById('modalDialog1').close();
      };

      // eslint-disable-next-line no-unused-vars
      self.open = function (event) {
        document.getElementById('modalDialog1').open();
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
    return IncidentsViewModel;
  }
);
