/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/*
 * Your incidents ViewModel code goes here
 */
define(['knockout', 'ojs/ojcore', 'appController', 'ojs/ojmodule-element-utils', 'accUtils', 'ojs/ojlistview', 'ojs/ojtable', 'ojs/ojselectcombobox',
  'ojs/ojinputtext', 'ojs/ojaccordion', 'ojs/ojdialog', 'ojs/ojarraydataprovider', 'ojs/ojchart', 'ojs/ojarraytabledatasource',
  'ojs/ojdatetimepicker', 'ojs/ojtimezonedata', 'ojs/ojprogress', 'ojs/ojselectsingle', 'ojs/ojtoolbar', 'ojs/ojlistitemlayout'],
  function (ko, oj, app, moduleUtils, accUtils) {

    function ModeloEvaluacionIndividual() {
      var self = this;
      var grupos = {};
      self.datosAlumno = ko.observable();
      self.idAlumno = ko.observable();
      self.dataProvider = ko.observable();
      self.datosEstatura = ko.observable();
      self.orientationValue = ko.observable();
      self.origenDatosNombres = ko.observable();
      self.alumnoSeleccionado = ko.observable();
      self.nuevoEscuelaAlumno = ko.observable();
      self.origenDatosEscuelas = ko.observable();
      self.origenDatosGrupos = ko.observable();
      self.nuevoSexoAlumno = ko.observable();
      self.nuevoGradoAlumno = ko.observable();
      self.nuevoGrupoAlumno = ko.observable();
      self.colorIndicador = ko.observable("#237BB1");
      self.datosIMC = ko.observable();
      self.datosEstatura = ko.observable();
      self.datosPeso  = ko.observable();
      self.tituloIMC = ko.pureComputed(function () {
        return {
            title: "Histórico IMC"
        };
      });

      self.tituloTalla = ko.pureComputed(function () {
        return {
            title: "Histórico Talla"
        };
      });

      self.tituloPeso = ko.pureComputed(function () {
          return {
              title: "Histórico Peso"
          };
      });

      function ChartModel() {
        /* toggle button variables */
        this.orientationValue = ko.observable('vertical');
        this.dataProvider = new oj.ArrayDataProvider(JSON.parse(mediciones), { keyAttributes: 'id' });
        this.datosEstatura = new oj.ArrayDataProvider(JSON.parse(mediciones), { keyAttributes: 'id' });
      }

      var peticionGrupos = new XMLHttpRequest();
      peticionGrupos.open("GET", oj.gWSUrl() + "grupos/obtenerTodosLosGrupos/hoy", false);
      peticionGrupos.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status === 200) {
            var jsonResponse = JSON.parse(this.responseText);
            if (jsonResponse.hasOwnProperty("error")) {
              alert('Error al inicializar el modulo, por favor contacta al administrador.');
            } else {
              if (Object.keys(jsonResponse).length < 1) {
                alert("Debe agregar un grupo para agregar nuevos alumnos o mediciones.")
              } else {
                grupos = jsonResponse;
                var gruposEscuela = $.extend([], grupos[Object.keys(grupos)[0]]);
                gruposEscuela.splice(0, 0, { value: -1, label: "NO SELECCIONADO" });
                self.origenDatosGrupos(new oj.ArrayDataProvider(gruposEscuela, { keyAttributes: 'value' }));
                self.nuevoGrupoAlumno(-1);
                self.nuevoEscuelaAlumno(-1);
              }
            }
          }
        }
      };      

      $.ajax({
        type: "GET",
        contentType: "text/plain; charset=utf-8",
        url: oj.gWSUrl() + "obtenerEscuelas",
        dataType: "text",
        async: false,
        success: function (data) {
          json = JSON.parse(data);
          if (json.hasOwnProperty("error")) {
            alert('No se encontro ninguna escuela');
            return;
          } else {
            json.escuelas.splice(0, 0, {value:-1,label:"NO SELECCIONADA"});
            self.origenDatosEscuelas(new oj.ArrayDataProvider(json.escuelas));
            peticionGrupos.send();
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
      });

      self.escuelaSeleccionada = function (event) {
        var id_escuela = event['detail'].value.toString();
        if (id_escuela !== "" && Object.keys(grupos).length > 0) {
          var gruposEscuela;
          if (grupos.hasOwnProperty(id_escuela)) {
            gruposEscuela = $.extend([], grupos[id_escuela]);
            gruposEscuela.splice(0, 0, { value: -1, label: "NO SELECCIONADO" });
          } else {
            gruposEscuela = [{ value: -1, label: "NO SELECCIONADO" }];
          }
          self.origenDatosGrupos(new oj.ArrayDataProvider(gruposEscuela, { keyAttributes: 'value' }));
          self.nuevoGrupoAlumno(-1);
        }
      };

      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.
      self.obtenerInfo = function () {
        $.ajax({
          type: "GET",
          contentType: "text/plain; charset=utf-8",
          url: oj.gWSUrl() + "alumnos/obtenerDatos/" + self.idAlumno(),
          dataType: "text",
          async: false,
          success: function (data) {
            json = JSON.parse(data);
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
                    campo["campo"] = llave[0].toUpperCase() + llave.slice(1).replace("_", " ");
                    break;
                }
                campo["valor"] = json.datos[0][llave];
                if(!llave.includes("id")) {
                  campos.push(campo);
                  indice++;
                }
              }
              self.datosAlumno(new oj.ArrayDataProvider(campos, { keyAttributes: 'id' }));
              self.colorIndicador(json.datos[0].sexo === "FEMENINO" ? "#E4007C" : "#237BB1"); 
            }
          }
        }).fail(function () {
          alert("Error en el servidor, favor de comunicarse con el administrador.");
          return;
        });

        $.ajax({
          type: "GET",
          contentType: "text/plain; charset=utf-8",
          url: oj.gWSUrl() + "alumnos/obtenerMediciones/" + self.idAlumno(),
          dataType: "text",
          async: false,
          success: function (data) {
            json = JSON.parse(data);
            if (json.hasOwnProperty("error")) {
              if(json.error === "No hay datos.") {
                var listaMediciones = document.getElementById("listaMediciones");
                if(listaMediciones !== undefined && listaMediciones !== null) {
                  listaMediciones.remove();
                }
              } else {
                alert('Error interno en el servidor, por favo contacta al administrador.');
              }
              return;
            } else {
              document.getElementById("listaMediciones").remove();
              var contenedor = document.getElementById("contenedorMediciones");
              var accordion = document.createElement('oj-accordion');
              accordion.setAttribute("id", "listaMediciones");

              json.mediciones.forEach(medicion => {
                var colapsableMedicion = document.createElement('oj-collapsible');                
                var fechaMedicion = document.createElement('h3');
                fechaMedicion.setAttribute('slot', 'header');

                var listaVista = document.createElement('oj-list-view');
                var lista = document.createElement('ul');

                for (var llave in medicion) {
                  if (llave === "id_alumno" || llave.includes("id")) {
                    continue;
                  } else if (llave === "fecha") {
                    fechaMedicion.innerText = medicion[llave];
                    continue;
                  }
                  
                  var linea = document.createElement('li');
                  var contenido = document.createElement('oj-list-item-layout');
                  var objMedicion = document.createElement('span');
                  objMedicion.innerText = medicion[llave];

                  var campo = document.createElement('span');

                  switch (llave) {
                    case "masa":
                      campo.innerText = "Peso";
                      break;
                    case "imc":
                      campo.innerText = "Indice de Masa Corporal";
                      break;
                      case "estatura":
                        campo.innerText = "Talla";
                        break;
                    case "perimetro_cuello":
                      campo.innerText = "Perimetro del cuello";
                      break;
                    case "pliegue_cuello":
                      campo.innerText = "Pliegue del cuello";
                      break;
                    case "subescapula":
                      campo.innerText = "Subescapular";
                      break;
                    case "diagnostico_peso":
                    case "diagnostico_talla":
                    case "diagnostico_imc":
                      var nombreMedicion = llave.split("_")[1];
                      campo.innerText = "Diagnóstico " + (nombreMedicion.includes("imc") ? "IMC" : (nombreMedicion[0].toUpperCase() + nombreMedicion.slice(1)));
                      break;
                    case "z_peso":
                    case "z_talla":
                    case "z_imc":
                      var nombreMedicion = llave.split("_")[1];
                      campo.innerText = "Puntaje Z " + (nombreMedicion.includes("imc") ? "IMC" : (nombreMedicion[0].toUpperCase() + nombreMedicion.slice(1)));
                      break;
                    default:                    
                      campo.innerText = llave[0].toUpperCase() + llave.slice(1).replace("_", " ");
                      break;
                  }
                  campo.classList.add("oj-text-color-secondary");
                  campo.setAttribute('slot', 'secondary');

                  contenido.appendChild(objMedicion);
                  contenido.appendChild(campo);
                  linea.appendChild(contenido);
                  lista.appendChild(linea);
                }

                listaVista.appendChild(lista);
                colapsableMedicion.appendChild(fechaMedicion);
                colapsableMedicion.appendChild(listaVista);
                accordion.appendChild(colapsableMedicion);
              });

              contenedor.appendChild(accordion);
              ko.applyBindings(self, accordion);
            }
          }
        }).fail(function () {
          alert("Error en el servidor, favor de comunicarse con el administrador.");
          return;
        });

        var mediciones = ["imc", "talla", "peso"];
        mediciones.forEach(function callback(medicionActual) {
          var peticionHistotico = new XMLHttpRequest();
          peticionHistotico.open("GET", oj.gWSUrl() + "alumnos/obtenerHistorico/" + medicionActual + "/" + self.idAlumno(), true);
          peticionHistotico.onreadystatechange = function () {
            if (this.readyState === 4) {
              if (this.status === 200) {
                var jsonResponse = JSON.parse(this.responseText);
                if (jsonResponse.hasOwnProperty("error")) {
                  if (jsonResponse.error === "No hay datos.") {
                    switch(medicionActual) {
                      case "imc":
                        self.datosIMC(new oj.ArrayDataProvider([]));
                        break;
                      case "talla":
                        self.datosEstatura(new oj.ArrayDataProvider([]));
                        break;
                      case "peso":
                        self.datosPeso(new oj.ArrayDataProvider([]));
                        break;
                    } 
                  } else {
                    alert('No es posible obtener los datos, por favor contacta al administrador.');
                  }
                  return;
                } else {
                  switch(medicionActual) {
                    case "imc":
                      self.datosIMC(new oj.ArrayDataProvider(jsonResponse.mediciones, { keyAttributes: 'id' }));
                      break;
                    case "talla":
                      self.datosEstatura(new oj.ArrayDataProvider(jsonResponse.mediciones, { keyAttributes: 'id' }));
                      break;
                    case "peso":
                      self.datosPeso(new oj.ArrayDataProvider(jsonResponse.mediciones, { keyAttributes: 'id' }));
                      break;
                  }
                }
              } else {
                alert("Error en el servidor, favor de comunicarse con el administrador.");
              }
            }
          };
          peticionHistotico.send();
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
          url: oj.gWSUrl() + "alumnos/buscarPorNombre/" + nombreAlumno,
          dataType: "text",
          async: false,
          success: function (data) {
            json = JSON.parse(data);
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
                json = JSON.parse(data);
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
                json = JSON.parse(data);
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
        var datos = '{"NoData":""}';
        datos = JSON.parse("[" + datos + "]");
        document.getElementById('num-alumno').value = self.alumnoSeleccionado()._keys.values().next().value;
        document.getElementById('nombreABuscar').value = '';
        self.origenDatosNombres(new oj.ArrayDataProvider(datos));
        document.getElementById('dialogoBuscarAlumno').close();
        self.obtenerInfo();
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
        accUtils.announce('Pagina Evaluación Individual Cargada.');
        document.title = "Evaluación Individual";
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
    return ModeloEvaluacionIndividual;
  }
);
