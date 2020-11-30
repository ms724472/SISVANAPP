/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/*
 * Your incidents ViewModel code goes here
 */
define(['knockout', 'jquery', 'ojs/ojcore', 'appController', 'ojs/ojmodule-element-utils', 'accUtils', 'ojs/ojknockout-keyset', 'ojs/ojlistview', 'ojs/ojtable', 'ojs/ojselectcombobox',
  'ojs/ojinputtext', 'ojs/ojaccordion', 'ojs/ojdialog', 'ojs/ojarraydataprovider', 'ojs/ojchart', 'ojs/ojarraytabledatasource', 'ojs/ojswitch',
  'ojs/ojdatetimepicker', 'ojs/ojtimezonedata', 'ojs/ojprogress', 'ojs/ojselectsingle', 'ojs/ojtoolbar', 'ojs/ojlistitemlayout', 'ojs/ojvalidation-datetime'],
  function (ko, $, oj, app, moduleUtils, accUtils, keySet) {

    function ModeloEvaluacionIndividual() {
      var self = this;
      var grupos = {};
      var datosAlumnoActual = {};  
      var medicionesAlumnoActual = [];
      var numeroDeMedida = 0;
      self.datosAlumno = ko.observable();
      self.idAlumno = ko.observable();
      self.dataProvider = ko.observable();
      self.datosEstatura = ko.observable();
      self.orientationValue = ko.observable();
      self.origenDatosNombres = ko.observable();
      self.alumnoSeleccionado = ko.observable();
      self.origenDatosEscuelas = ko.observable();
      self.origenDatosGrupos = ko.observable();
      self.nuevoGradoAlumno = ko.observable();
      self.colorIndicador = ko.observable("#237BB1");
      self.datosIMC = ko.observable();
      self.datosEstatura = ko.observable();
      self.datosPeso  = ko.observable();
      self.idNuevoAlumno = ko.observable();
      self.nombreNuevoAlumno = ko.observable();
      self.apellidoPNuevoAlumno = ko.observable();
      self.apellidoMNuevoAlumno = ko.observable();
      self.sexoNuevoAlumno = ko.observable();
      self.fNacimientoNuevoAlumno = ko.observable();
      self.nuevoEscuelaAlumno = ko.observable();
      self.nuevoGrupoAlumno = ko.observable();
      self.idDeshabilitado = ko.observable(false);
      self.tituloDialogoAlumno = ko.observable("Agregar nuevo alumno");
      self.botonFormularioAlumno = ko.observable("Agregar");
      self.tituloDialogoMedicion = ko.observable("Agregar nueva medición");
      self.botonFormularioMedicion = ko.observable("Agregar");
      self.fechaMedicion = ko.observable();
      self.peso = ko.observable();
      self.talla = ko.observable();
      self.perCuello = ko.observable();
      self.cintura = ko.observable();
      self.triceps = ko.observable();
      self.subEscapular = ko.observable();
      self.pliegueCuello = ko.observable();
      self.evitarCiclo = ko.observable(false);
      self.nuevaMedida = ko.observable();
      self.medidas = ko.observableArray([]);
      self.medidaSeleccionada = new keySet.ObservableKeySet();  
      self.listaMedidas = new oj.ArrayDataProvider(this.medidas, { keyAttributes: 'id' });
      self.medidaVacia = ko.observable(true);
      self.medianaCalculada = ko.observable("");
      self.medidaACalcular = ko.observable("");
      self.limiteAlumno = ko.observable(0);

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

      $(document).ready(function () {
        $("#num-alumno\\|input").on('keyup', function (e) {
          if (e.key === 'Enter' || e.keyCode === 13) {
            self.obtenerInfo();
          }
        });
      });

      self.convertidorFechas = ko.observable(oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).
        createConverter(
          {
            pattern: "dd/MM/yyyy"
          }));

      self.validadorNumerico = ko.computed(function () {
        return [{
          type: 'regExp',
          options: {
            pattern: '[0-9]+',
            messageSummary: 'Valor inválido',
            messageDetail: 'Corrija el campo.'
          }
        }];
      });

      self.validadorMedicion = ko.computed(function () {
        return [{
          type: 'regExp',
          options: {
            pattern: '\\d+(\\.\\d\{1,2})?',
            messageSummary: 'Valor inválido',
            messageDetail: 'Corrija el campo.'
          }
        }];
      });

      self.validadorEstatura = ko.computed(function () {
        return [{
          type: 'regExp',
          options: {
            pattern: '1[0-9]{2}(\\.[0-9]+)?',
            messageSummary: 'Valor inválido',
            messageDetail: 'Debe ser en cm.'
          }
        }];
      });

      self.validadorTexto = ko.computed(function () {
        return [{
          type: 'regExp',
          options: {
            pattern: '[\\w\\s]+',
            messageSummary: 'Valor inválido',
            messageDetail: 'Corrija el campo.'
          }
        }];
      });

      self.validadorFechas = ko.computed(function () {
        return [{
          type: 'regExp',
          options: {
            pattern: '.+',
            messageSummary: 'Valor inválido',
            messageDetail: 'Corrija el campo.'
          }
        }];
      });

      self.validadorGrupos = ko.computed(function () {
        return [{
          type: 'numberRange',
          options: {
            min: 1,
            messageSummary: 'Grupo invalido',
            messageDetail: 'Selecciona un grupo.'
          }
        }];
      });

      function ChartModel() {
        /* toggle button variables */
        this.orientationValue = ko.observable('vertical');
        this.dataProvider = new oj.ArrayDataProvider(JSON.parse(mediciones), { keyAttributes: 'id' });
        this.datosEstatura = new oj.ArrayDataProvider(JSON.parse(mediciones), { keyAttributes: 'id' });
      }      

      function manejarErrores(error) {
        alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
        console.log("Error en la base de datos: " + JSON.stringify(error));
      }

      function procesarGrupos(transaccion, resultados) {
        var numFilas = resultados.rows.length;
        var gruposBD = [];
        gruposBD.push({ value: -1, label: "NO SELECCIONADA" });
        
        var gruposEscuelaActual = [];
        var idEscuelaActual;

        for (var indiceFila = 0; indiceFila < numFilas; indiceFila++) {
          if(indiceFila === 0) {
            idEscuelaActual = resultados.rows.item(indiceFila).id_escuela;
          } else if(resultados.rows.item(indiceFila).id_escuela !== idEscuelaActual) {
            grupos[idEscuelaActual.toString()] = gruposEscuelaActual;
            gruposEscuelaActual = [];
            idEscuelaActual = resultados.rows.item(indiceFila).id_escuela;
          }
          
          var hoy = new Date();
          var fechaIngreso = new Date('08/01/' + resultados.rows.item(indiceFila).anio_ingreso);
          var diferencia = (((hoy.getFullYear() - fechaIngreso.getFullYear()) * 12) + (hoy.getMonth() - fechaIngreso.getMonth()))/12;
          var grado = Math.ceil(diferencia);;
          var grupoBD = {};
          grupoBD.value = resultados.rows.item(indiceFila).id_grupo;
          grupoBD.label = grado + " " + resultados.rows.item(indiceFila).letra;
          gruposEscuelaActual.push(grupoBD);

          if(indiceFila === numFilas-2) {
            grupos[idEscuelaActual.toString()] = gruposEscuelaActual;
          }
        }
        
        self.origenDatosGrupos(new oj.ArrayDataProvider(gruposBD, { keyAttributes: 'value' }));
        self.nuevoGrupoAlumno(-1);
        self.nuevoEscuelaAlumno(-1);
      }

      function procesarEscuela(transaccion, resultados) {
        var numFilas = resultados.rows.length;
        var escuelasBD = [];
        escuelasBD.push({value:-1,label:"NO SELECCIONADA"});

        for (var indiceFila = 0; indiceFila < numFilas; indiceFila++) {
          var escuelaDB = {};
          escuelaDB.value = resultados.rows.item(indiceFila).id_escuela;
          escuelaDB.label = resultados.rows.item(indiceFila).nombre;
          escuelasBD.push(escuelaDB);   
        }

        self.origenDatosEscuelas(new oj.ArrayDataProvider(escuelasBD, { keyAttributes: 'value' }));

        var consultaGrupos = "SELECT * FROM grupos";
        oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql(consultaGrupos,
            [], procesarGrupos, manejarErrores);
        }, function (error) {
          alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
          console.log("Error en la base de datos: " + error.message);
        });
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
                self.nuevoEscuelaAlumno(null);
              }
            }
          }
        }
      };      

      if(!oj.gOfflineMode()) {
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
              json.escuelas.splice(0, 0, { value: -1, label: "NO SELECCIONADA" });
              self.origenDatosEscuelas(new oj.ArrayDataProvider(json.escuelas));   
              peticionGrupos.send();
            }
          }
        }).fail(function () {
          alert("Error en el servidor, favor de comunicarse con el administrador.");
          return;
        });
      } else {
        var consultaDesconexion = "SELECT * FROM escuelas";
        oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql(consultaDesconexion,
            [], procesarEscuela, manejarErrores);
        }, function (error) {
          alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
          console.log("Error en la base de datos: " + JSON.stringify(error));
        });        
      }

      // Header Config
      self.headerConfig = ko.observable({ 'view': [], 'viewModel': null });
      moduleUtils.createView({ 'viewPath': 'views/header.html' }).then(function (view) {
        self.headerConfig({ 'view': view, 'viewModel': new app.getHeaderModel() })
      });

      self.escuelaSeleccionada = function (event) {
        var id_escuela = event['detail'].value === null ? "-1" : event['detail'].value.toString();
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

      self.procesarDatos = function(datos) {
        var campos = [];
        var indice = 0;
        for (var llave in datos) {
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

          campo["valor"] = datos[llave];

          if(llave === "nombre") {
            campo["valor"] = campo["valor"].replace("-E", "");
          }
                    
          if(!llave.includes("id_")) {
            campos.push(campo);
            indice++;
          }
        }
        self.datosAlumno(new oj.ArrayDataProvider(campos, { keyAttributes: 'id' }));
        self.colorIndicador(datos.sexo === "FEMENINO" ? "#E4007C" : "#237BB1");
        datosAlumnoActual = datos; 
      };

      self.procesarMediciones = function(jsonMediciones) {
        var listaMediciones = document.getElementById("listaMediciones");
        if (listaMediciones !== undefined && listaMediciones !== null) {
          listaMediciones.remove();
        }
        var contenedor = document.getElementById("contenedorMediciones");
        var accordion = document.createElement('oj-accordion');
        accordion.setAttribute("id", "listaMediciones");
        medicionesAlumnoActual = jsonMediciones;

        jsonMediciones.forEach(medicion => {
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
            if(llave === "diagnostico_peso") {
              objMedicion.innerText = medicion[llave].replace("-E", "");
            } else {
              objMedicion.innerText = medicion[llave];
            }

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
      };

      self.diferenciaMeses = function(fecha1, fecha2, redondearHaciaArriba) {
        var fechaInicial = fecha1;
        var fechaFinal = fecha2;
        var invertida = false;
        if (fecha1 > fecha2) {
          fechaInicial = fecha2;
          fechaFinal = fecha1;
          invertida = true;
        }

        var aniosDiferencia = fechaFinal.getFullYear() - fechaInicial.getFullYear();
        var mesesDiferencia = fechaFinal.getMonth() - fechaInicial.getMonth();
        var diasDiferencia = fechaFinal.getDate() - fechaInicial.getDate();

        var correcionMeses = 0;
        if (redondearHaciaArriba === true && diasDiferencia > 0) {
          correcionMeses = 1;
        } else if (redondearHaciaArriba !== true && diasDiferencia < 0) {
          correcionMeses = -1;
        }

        return (invertida ? -1 : 1) * (aniosDiferencia * 12 + mesesDiferencia + correcionMeses);
      };

      function procesarMedicionesDB(transaccion, resultados) {
        var numFilas = resultados.rows.length;
        var jsonMediciones = [];        
        for (var indiceFila = 0; indiceFila < numFilas; indiceFila++) {
          var fila = resultados.rows.item(indiceFila);
          var compFecha = fila.fecha.split("-");  
          var compFechaNac = fila.fecha_nac.split("-");  
          var fechaMedicion = new Date(compFecha[0], compFecha[1], compFecha[2]); 
          var fechaNac = new Date(compFechaNac[0], compFechaNac[1], compFechaNac[2]); 
          var meses = self.diferenciaMeses(fechaNac, fechaMedicion, false);
          var gruposEscuela = grupos[fila.id_escuela.toString()];
          var grupo = "";
          gruposEscuela.some(function(grupoActual) {
            if(grupoActual.value === fila.id_grupo) {
              grupo = grupoActual.label;
              return true;
            }
          });
          var medicionActual = {
            meses: meses,
            grupo: grupo,
            fecha: compFecha[2] + "/" + compFecha[1] + "/" + compFecha[0],
            masa: fila.masa,
            diagnostico_peso: fila.diagnostico_peso,
            z_peso: fila.z_peso,
            estatura: fila.estatura,
            diagnostico_talla: fila.diagnostico_talla,
            z_talla: fila.z_talla,
            imc: fila.imc.toFixed(2),
            diagnostico_imc: fila.diagnostico_imc,
            z_imc: fila.z_imc,
            perimetro_cuello: fila.perimetro_cuello,
            cintura: fila.cintura,
            triceps: fila.triceps,
            subescapula: fila.subescapula,
            pliegue_cuello: fila.pliegue_cuello
          };
          jsonMediciones.push(medicionActual);
        }
        self.procesarMediciones(jsonMediciones);
      }

      function procesarDatosDB(transaccion, resultados) {
        var numFilas = resultados.rows.length;
        for (var indiceFila = 0; indiceFila < numFilas; indiceFila++) {
          var fila = resultados.rows.item(indiceFila);
          var compFecha = fila.fecha_nac.split("-");
          var gruposEscuela = grupos[fila.id_escuela.toString()];
          var grado = "";
          var grupo = "";
          gruposEscuela.some(function(grupoActual) {
            if(grupoActual.value === fila.id_grupo) {
              var compGrupo = grupoActual.label.split(" ");     
              grado = compGrupo[0];
              grupo = compGrupo[1];
              return true;
            }
          });
          var datosJSON = {
            nombre: fila.nombre,
            apellido_p: fila.apellido_p,
            apellido_m: fila.apellido_m,
            sexo: fila.sexo.toUpperCase(),
            fecha_nac: compFecha[2] + "/" + compFecha[1] + "/" + compFecha[0],
            escuela: self.origenDatosEscuelas().data[fila.id_escuela].label,
            grado: grado,
            grupo: grupo
          };
          self.procesarDatos(datosJSON);
        }

        oj.gConexionDB().transaction(function(transaccion) {
          transaccion.executeSql("SELECT datos.*, grupos.id_escuela, alumnos.fecha_nac FROM datos INNER JOIN alumnos ON datos.id_alumno = alumnos.id_alumno INNER JOIN grupos ON alumnos.id_grupo = grupos.id_grupo WHERE datos.id_alumno = ?",
          [self.idAlumno()], procesarMedicionesDB, manejarErrores);            
        }, function(error){
            alert("Error durante la inicialización, intente reiniciando la aplicación, si la falla persiste contecte al soporte técnico.");
            console.log("Error en la base de datos: " + error.message);
        });
      }

      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.
      self.obtenerInfo = function () {
        if(oj.gOfflineMode() !== true) {        
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
                self.procesarDatos(json.datos[0]);
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
                  alert('Error interno en el servidor, por favor contacta al administrador.');
                }
                return;
              } else {
                self.procesarMediciones(json.mediciones);
              }
            }
          }).fail(function () {
            alert("Error en el servidor, favor de comunicarse con el administrador.");
            return;
          });
      } else {
        oj.gConexionDB().transaction(function(transaccion) {
          transaccion.executeSql("SELECT alumnos.*, grupos.id_escuela FROM alumnos INNER JOIN grupos ON alumnos.id_grupo = grupos.id_grupo WHERE id_alumno = ?",
          [self.idAlumno()], procesarDatosDB, manejarErrores);            
        }, function(error){
            alert("Error durante la inicialización, intente reiniciando la aplicación, si la falla persiste contecte al soporte técnico.");
            console.log("Error en la base de datos: " + error.message);
        });
      }
        
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

      self.valorMedidaCambio = function (event) {
        var valor = event.detail.value;
        self.medidaVacia(valor.trim().length === 0);
        self.nuevaMedida(valor);
      }.bind(self);

      self.calcularMedia = function() {
        if(self.medidas().length === 0) {
          self.medianaCalculada("");
          return;
        }

        var media = 0;

        ko.utils.arrayForEach(self.medidas(), function(medida) {
          media = media + parseFloat(medida.item);
        });

        media = (Math.round((media/self.medidas().length) * 100) / 100).toFixed(2);
        self.medianaCalculada(media);
      };

      self.sinSeleccion = ko.computed(function () {
        return self.medidaSeleccionada().values().size === 0;
      }, self);

      self.agregarMedida = function () {
        var nuevaMedida = document.getElementById("nuevaMedida");
        nuevaMedida.validate();

        if(nuevaMedida.valid === 'invalidShown') {
          return;
        }
        var medidaFormateada = (Math.round(parseFloat(self.nuevaMedida()) * 100) / 100).toFixed(2);
        numeroDeMedida++;
        self.medidas.push({ id: numeroDeMedida, item:  medidaFormateada});
        self.nuevaMedida("");
        self.calcularMedia();        
      }.bind(self);

      self.eliminarMedida = function() {
        self.medidaSeleccionada().values().forEach(function (id) {
          self.medidas.remove(function (item) {
            return (item.id === id);
          });
        }.bind(self));

        self.calcularMedia();   
      }.bind(self);

      self.calcularMediana = function(event) {
        self.medidaACalcular(event.target.parentElement.parentElement.id);
        document.getElementById("dialogoMediana").open();
      };

      self.llenarCampo = function() {
        document.getElementById(self.medidaACalcular()).value = self.medianaCalculada();
        self.cancelarMediana();
      };

      self.cancelarMediana = function() {
        numeroDeMedida = 0;
        self.nuevaMedida("");
        self.medidas.remove(function (item) {
          return true;
        });
        self.medianaCalculada("");
        document.getElementById("dialogoMediana").close();
      }.bind(self);

      self.sincronizarDatos = function() {
        document.getElementById('dialogoSincronizacion').open();
      };

      function notificarConexion(transaccion, resultados) { 
        oj.gOfflineMode(false);
      }

      function notificarDesconexion(transaccion, resultados) {
        document.getElementById('dialogoDescarga').close();
      }

      self.actualizarBanderDesconexion = function (valor) {
        var consultaDesconexion = "UPDATE parametros SET valor = ? WHERE nombre = 'desconectada'";
        oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql(consultaDesconexion,
            [valor], valor === "si" ? notificarDesconexion : notificarConexion, manejarErrores);
        }, function (error) {
          alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
          console.log("Error en la base de datos: " + JSON.stringify(error));
        });
      };

      function reportarLimpiezaDatos(transaccion, resultados) {
        
      }
      
      function reportarDescargaAlumno(transaccion, resultados) {

      }

      function reportarDescargaMedicion(transaccion, resultados) {

      }

      function reportarDescargaGrupos(transaccion, resultados) {
        console.log("Descarga de grupos terminada.");    
        self.limiteAlumno(self.limiteAlumno()-1);
        if(self.limiteAlumno() === 0) {
          var peticionAlumnos = new XMLHttpRequest();
          peticionAlumnos.open("GET", oj.gWSUrl() + "escuelas/obtenerAlumnos/" + self.nuevoEscuelaAlumno(), true);
          peticionAlumnos.onreadystatechange = function () {
            if (this.readyState === 4) {
              if (this.status === 200) {
                var json = JSON.parse(this.responseText);
                self.nuevoEscuelaAlumno(-1);
                Object.entries(json.alumnos).forEach(([indiceAlumno, alumno]) => {
                  var consultaInsertarAlumno = "INSERT INTO alumnos(id_alumno, nombre, apellido_p, apellido_m, sexo, fecha_nac, id_grupo) VALUES(?,?,?,?,?,?,?)";
                  var fechaComp = alumno.datos.fecha_nac.split("/");
                  var fechaNacimiento = fechaComp[2] + "-" + fechaComp[1] + "-" + fechaComp[0];
                  var parametros = [
                    alumno.id_alumno,
                    alumno.datos.nombre + "-E",   
                    alumno.datos.apellido_p, 
                    alumno.datos.apellido_m, 
                    alumno.datos.sexo.toLowerCase(),
                    fechaNacimiento,
                    alumno.datos.id_grupo
                  ];
                  oj.gConexionDB().transaction(function (transaccion) {
                    transaccion.executeSql(consultaInsertarAlumno,
                      parametros, reportarDescargaAlumno, manejarErrores);
                  }, function (error) {
                    alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
                    console.log("Error en la base de datos: " + error.message);
                    return;
                  });

                  Object.entries(alumno.mediciones).forEach(([indiceMedicion, medicion]) => {
                    var consultaInsertarMedicion = "INSERT INTO datos(id_alumno, id_grupo, fecha, masa, diagnostico_peso, z_peso, estatura,  diagnostico_talla, z_talla, diagnostico_imc, z_imc, perimetro_cuello, cintura, triceps, subescapula, pliegue_cuello) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    var fechaComp = medicion.fecha.split("/");
                    var fecha = fechaComp[2] + "-" + fechaComp[1] + "-" + fechaComp[0];
                    var parametros = [
                      medicion.id_alumno,                      
                      medicion.id_grupo,                    
                      fecha,
                      medicion.masa,
                      medicion.diagnostico_peso + "-E",
                      medicion.z_peso,
                      medicion.estatura,
                      medicion.diagnostico_talla,
                      medicion.z_talla,
                      medicion.diagnostico_imc,
                      medicion.z_imc,
                      medicion.perimetro_cuello,
                      medicion.cintura,
                      medicion.triceps,
                      medicion.subescapula,
                      medicion.pliegue_cuello
                    ];
                    oj.gConexionDB().transaction(function (transaccion) {
                      transaccion.executeSql(consultaInsertarMedicion,
                        parametros, reportarDescargaMedicion, manejarErrores);
                    }, function (error) {
                      alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
                      console.log("Error en la base de datos: " + error.message);
                      return;
                    });
                  });
                });
              }
            }
          }
          peticionAlumnos.send();
        } 
      }

      self.descargarAlumnos = function() {
        var peticionAlumnos = new XMLHttpRequest();
          peticionAlumnos.open("GET", oj.gWSUrl() + "escuelas/obtenerAlumnos/" + self.nuevoEscuelaAlumno(), true);
          peticionAlumnos.onreadystatechange = function () {
            if (this.readyState === 4) {
              if (this.status === 200) {
                var json = JSON.parse(this.responseText);
                Object.entries(json.alumnos).forEach(([indiceAlumno, alumno]) => {
                  var consultaInsertarAlumno = "INSERT INTO alumnos(id_alumno, nombre, apellido_p, apellido_m, sexo, fecha_nac, id_grupo) VALUES(?,?,?,?,?,?,?)";
                  var fechaComp = alumno.datos.fecha_nac.split("/");
                  var fechaNacimiento = fechaComp[2] + "-" + fechaComp[1] + "-" + fechaComp[0];
                  var parametros = [
                    alumno.id_alumno,
                    alumno.datos.nombre + "-E",   
                    alumno.datos.apellido_p, 
                    alumno.datos.apellido_m, 
                    alumno.datos.sexo.toLowerCase(),
                    fechaNacimiento,
                    alumno.datos.id_grupo
                  ];
                  oj.gConexionDB().transaction(function (transaccion) {
                    transaccion.executeSql(consultaInsertarAlumno,
                      parametros, reportarDescargaAlumno, manejarErrores);
                  }, function (error) {
                    alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
                    console.log("Error en la base de datos: " + error.message);
                    return;
                  });

                  Object.entries(alumno.mediciones).forEach(([indiceMedicion, medicion]) => {
                    var consultaInsertarMedicion = "INSERT INTO mediciones(id_alumno, id_grupo, fecha, masa, diagnostico_peso, z_peso, estatura,  diagnostico_talla, z_talla, imc, diagnostico_imc, z_imc, perimetro_cuello, cintura, triceps, subescapula, pliegue_cuello) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    var fechaComp = alumno.datos.fecha.split("/");
                    var fecha = fechaComp[2] + "-" + fechaComp[1] + "-" + fechaComp[0];
                    var parametros = [
                      medicion.id_alumno,                      
                      medicion.id_grupo,                    
                      fecha,
                      medicion.masa,
                      medicion.diagnostico_peso,
                      medicion.z_peso,
                      medicion.estatura,
                      medicion.diagnostico_talla,
                      medicion.z_talla,
                      medicion.imc,
                      medicion.diagnostico_imc,
                      medicion.z_imc,
                      medicion.perimetro_cuello,
                      medicion.cintura,
                      medicion.triceps,
                      medicion.subescapula,
                      medicion.pliegue_cuello
                    ];
                    oj.gConexionDB().transaction(function (transaccion) {
                      transaccion.executeSql(consultaInsertarMedicion,
                        parametros, reportarDescargaMedicion, manejarErrores);
                    }, function (error) {
                      alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
                      console.log("Error en la base de datos: " + error.message);
                      return;
                    });
                  });
                });
              }
              document.getElementById("dialogoSincronizacion").close();
            }
          }
          peticionAlumnos.send();
      };

      function reportarDescargaEscuela(transaccion, resultados) {
        console.log("Descarga de escuela terminada.");        
        var peticionGrupos = new XMLHttpRequest();
        peticionGrupos.open("GET", oj.gWSUrl() + "obtenerDatosGrupos/" + self.nuevoEscuelaAlumno(), true);
        peticionGrupos.onreadystatechange = function () {
          if (this.readyState === 4) {
            if (this.status === 200) {
              var json = JSON.parse(this.responseText);     
              self.limiteAlumno(parseInt(json.grupos.length)-1);          
              Object.entries(json.grupos).forEach(([indiceGrupo, grupo]) => {               
                if(grupo.grado !== "EGRESADO") {
                  var consultaInsertarGrupo = "INSERT INTO grupos(id_grupo, letra, anio_ingreso, id_escuela) VALUES(?,?,?,?)";
                  var parametros = [
                    grupo.id_grupo,
                    grupo.letra,   
                    grupo.anio_ingreso,
                    self.nuevoEscuelaAlumno()
                  ];
                  oj.gConexionDB().transaction(function (transaccion) {
                    transaccion.executeSql(consultaInsertarGrupo,
                      parametros, reportarDescargaGrupos, manejarErrores);
                  }, function (error) {
                    alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
                    console.log("Error en la base de datos: " + error.message);
                  });
                }            
              });
            }            
            document.getElementById("dialogoCargando").close();
          }
        };
        peticionGrupos.send();
      }

      self.descargarEscuela = function() {
        var fallo = false;
        document.getElementById("dialogoCargando").open();

        var consultaEliminarMediciones = "DELETE FROM datos";
        oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql(consultaEliminarMediciones,
            [], reportarLimpiezaDatos, manejarErrores);
        }, function (error) {
          alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
          console.log("Error en la base de datos: " + JSON.stringify(error));
          fallo = true;
        });

        if(fallo) {
          return;
        }

        var consultaEliminarAlumnos = "DELETE FROM alumnos";
        oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql(consultaEliminarAlumnos,
            [], reportarLimpiezaDatos, manejarErrores);
        }, function (error) {
          alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
          console.log("Error en la base de datos: " + JSON.stringify(error));
          fallo = true;
        });

        if(fallo) {
          return;
        }

        var consultaEliminarGrupos = "DELETE FROM grupos";
        oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql(consultaEliminarGrupos,
            [], reportarLimpiezaDatos, manejarErrores);
        }, function (error) {
          alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
          console.log("Error en la base de datos: " + JSON.stringify(error));
          fallo = true;
        });

        if(fallo) {
          return;
        }

        var consultaEliminarEscuelas = "DELETE FROM escuelas";
        oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql(consultaEliminarEscuelas,
            [], reportarLimpiezaDatos, manejarErrores);
        }, function (error) {
          alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
          console.log("Error en la base de datos: " + JSON.stringify(error));
          fallo = true;
        });      

        if(fallo) {
          return;
        }

        var peticionEscuelas = new XMLHttpRequest();
        peticionEscuelas.open("GET", oj.gWSUrl() + "obtenerDatosEscuelas", true);
        peticionEscuelas.onreadystatechange = function () {
          if (this.readyState === 4) {
            if (this.status === 200) {
              var json = JSON.parse(this.responseText);
              Object.entries(json.escuelas).some(([indiceEscuela, escuela]) => {
                if(escuela.id_escuela === self.nuevoEscuelaAlumno()) {
                  var consultaInsertarEscuela = "INSERT INTO escuelas VALUES(?,?,?,?,?,?,?,?,?)";
                  var parametros = [
                    escuela.id_escuela,
                    escuela.clave_sep,
                    escuela.nombre,
                    escuela.direccion,
                    escuela.colonia,
                    escuela.codigo_postal,
                    escuela.telefono,
                    escuela.municipio,
                    escuela.estado
                  ];
                  oj.gConexionDB().transaction(function (transaccion) {
                    transaccion.executeSql(consultaInsertarEscuela,
                      parametros, reportarDescargaEscuela, manejarErrores);
                  }, function (error) {
                    alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
                    console.log("Error en la base de datos: " + error.message);
                    return;
                  });

                  var jsonEscuelas = [
                    { value: -1, label: "NO SELECCIONADA" },
                    { value: escuela.id_escuela, label: escuela.nombre}
                  ];
                  
                  self.origenDatosEscuelas(new oj.ArrayDataProvider(jsonEscuelas)); 

                  return true;
                }
              });
              self.actualizarBanderDesconexion("si");
            } else {
              self.evitarCiclo(true);
              oj.gOfflineMode(false);
            }
          }
        };
        peticionEscuelas.send();
      };

      self.revisarDescarga = function() {
        if(self.evitarCiclo() === true) {
          self.evitarCiclo(false);
          return;
        }

        if(oj.gOfflineMode() === true) {
          if(self.nuevoEscuelaAlumno() === null || self.nuevoEscuelaAlumno() === undefined || self.nuevoEscuelaAlumno() === -1) { 
            alert("Selecciona una escuela");
            return;
          } 

          document.getElementById('dialogoDescarga').open();
        } else {
          self.actualizarBanderDesconexion("no");
        }
      };

      self.cancelarSincronizacion = function() {
        document.getElementById('dialogoSincronizacion').close();
      };

      self.cancelarDescarga = function() {
        document.getElementById('dialogoDescarga').close();
        self.evitarCiclo(true);
        oj.gOfflineMode(false);
      };

      self.buscarAlumno = function () {
        document.getElementById('dialogoBuscarAlumno').open();        
      };

      self.cancelarBusqueda = function () {
        document.getElementById('dialogoBuscarAlumno').close();
      };

      self.nuevaMedicion = function () {
        if(self.idAlumno() !== undefined && self.idAlumno() !== "" &&  Object.keys(datosAlumnoActual).length !== 0){
          self.origenDatosGrupos(new oj.ArrayDataProvider(grupos[datosAlumnoActual.id_escuela], { keyAttributes: 'value' }));
          self.nuevoGrupoAlumno(datosAlumnoActual.id_grupo);
          self.tituloDialogoMedicion("Agregar nueva medición");
          self.botonFormularioMedicion("Agregar");
          document.getElementById('dialogoNuevaMedicion').open();
        } else {
          alert("Selecciona o crea un alumno para agregar una nueva medición.")
        }
      };

      self.editarMedicion = function() {
        var listaMediciones = document.getElementById("listaMediciones");
        if (self.idAlumno() === undefined || self.idAlumno() === null || self.idAlumno() === "" || Object.keys(datosAlumnoActual).length === 0) {
          alert("Favor de seleccionar un alumno");
        }else if(listaMediciones === undefined || listaMediciones === null) {
          alert("Para editar mediciones es necesario tener al menos una.");
        } else {
          var mediciones = listaMediciones.getElementsByClassName("oj-expanded");
          if(mediciones.length < 1) {
            alert("Favor de seleccionar una medición");
          } else {
            var fechaMedicion = mediciones[0].firstChild.innerText;
            medicionesAlumnoActual.find(medicion => {
              if(medicion.fecha === fechaMedicion) {
                var compFecha = medicion.fecha.split("/");
                self.fechaMedicion(compFecha[2] + '-' + compFecha[1] + '-' + compFecha[0]);
                self.peso(medicion.masa.toString());
                self.talla(medicion.estatura.toString());
                self.perCuello(medicion.perimetro_cuello.toString());
                self.cintura(medicion.cintura.toString());
                self.triceps(medicion.triceps.toString());
                self.subEscapular(medicion.subescapula.toString());
                self.pliegueCuello(medicion.pliegue_cuello.toString());
                self.origenDatosGrupos(new oj.ArrayDataProvider(grupos[datosAlumnoActual.id_escuela], { keyAttributes: 'value' }));
                self.nuevoGrupoAlumno(medicion.id_grupo);
                self.tituloDialogoMedicion("Editar medición");
                self.botonFormularioMedicion("Guardar");
                document.getElementById('dialogoNuevaMedicion').open();
                return true;
              } 
              return false;
            });
          }
        } 
      };

      self.cancelarNuevaMedicion = function () {
        self.fechaMedicion("");
        self.peso("");
        self.talla("");
        self.perCuello("");
        self.cintura("");
        self.triceps("");
        self.subEscapular("");
        self.pliegueCuello("");
        self.nuevoGrupoAlumno(-1);
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
        self.tituloDialogoAlumno("Agregar nuevo alumno");
        self.botonFormularioAlumno("Agregar");
        document.getElementById('dialogoNuevoAlumno').open();
      };

      self.abrirDialogoEditarAlumno = function() {
        if(self.idAlumno() === undefined || self.idAlumno() === null || self.idAlumno() === "" || Object.keys(datosAlumnoActual).length === 0) {
          alert("Favor de seleccionar un alumno");
        }

        self.tituloDialogoAlumno("Editar alumno");
        self.botonFormularioAlumno("Guardar");
        self.idNuevoAlumno(self.idAlumno().toString());
        self.idDeshabilitado(true);
        self.nombreNuevoAlumno(datosAlumnoActual.nombre);
        self.apellidoPNuevoAlumno(datosAlumnoActual.apellido_p);
        self.apellidoMNuevoAlumno(datosAlumnoActual.apellido_m);
        self.sexoNuevoAlumno(datosAlumnoActual.sexo.toLowerCase());
        var compFechaNac = datosAlumnoActual.fecha_nac.split("/");
        self.fNacimientoNuevoAlumno(compFechaNac[2] + "-" + compFechaNac[1] + "-" + compFechaNac[0]);
        self.nuevoEscuelaAlumno(datosAlumnoActual.id_escuela);
        self.origenDatosGrupos(new oj.ArrayDataProvider(grupos[self.nuevoEscuelaAlumno()], { keyAttributes: 'value' }));
        self.nuevoGrupoAlumno(datosAlumnoActual.id_grupo);
        document.getElementById('dialogoNuevoAlumno').open();
      }

      self.cancelarNuevoAlumno = function() {
        document.getElementById('dialogoNuevoAlumno').close();
        self.idNuevoAlumno("");
        self.nombreNuevoAlumno("");
        self.apellidoPNuevoAlumno("");
        self.apellidoMNuevoAlumno("");
        self.sexoNuevoAlumno("femenino");
        self.fNacimientoNuevoAlumno("");
        self.nuevoEscuelaAlumno(null);
        self.nuevoGrupoAlumno(-1);
        self.idDeshabilitado(false);
        if (Object.keys(grupos).length > 0) {
          self.origenDatosGrupos(new oj.ArrayDataProvider([{NoData:""}]));
        }
      };

      self.crearNuevaMedicion = function () {
        var campoFecha = document.getElementById("nuevaFMedicion");
        var campoPeso = document.getElementById("nuevaMasaMedicion");
        var campoTalla = document.getElementById("nuevaEstaturaMedicion");
        var campoPerimetro = document.getElementById("nuevaPerimetroCuelloMedicion");
        var campoCintura = document.getElementById("nuevaCinturaMedicion");
        var campoTriceps = document.getElementById("nuevaTricepsMedicion");
        var campoSubescapular = document.getElementById("nuevaSubescapulaMedicion");
        var campoPliegue = document.getElementById("nuevaPliegueCuelloMedicion");

        campoFecha.validate();
        campoPeso.validate();
        campoTalla.validate();
        campoPerimetro.validate();
        campoCintura.validate();
        campoTriceps.validate();
        campoSubescapular.validate();
        campoPliegue.validate();

        if (self.nuevoGrupoAlumno() === -1 || self.nuevoGrupoAlumno() === null || self.nuevoGrupoAlumno() === undefined) {
          alert("Favor de seleccionar un grupo.");
          return;
        }

        if (campoFecha.valid === 'invalidShown' || campoPeso.valid === 'invalidShown' ||
          campoTalla.valid === 'invalidShown' || campoPerimetro.valid === 'invalidShown' ||
          campoCintura.valid === 'invalidShown' || campoTriceps.valid === 'invalidShown' ||
          campoSubescapular.valid === 'invalidShown' || campoPliegue.valid === 'invalidShown') {
          return;
        }

        document.getElementById('dialogoCargando').open();
        var bodyRequest = {
          id_alumno: self.idAlumno().toString(),
          fecha: self.fechaMedicion(),
          masa: self.peso(),
          estatura: self.talla(),
          id_grupo: self.nuevoGrupoAlumno().toString(),
          perimetro_cuello: self.perCuello(),
          cintura: self.cintura(),
          triceps: self.triceps(),
          subescapula: self.subEscapular(),
          pliegue_cuello: self.pliegueCuello()
        };

        var servicio = self.botonFormularioMedicion() === "Agregar" ?
          "agregarMedicion" :
          "actualizarMedicion";

        $.ajax({
          type: "POST",
          contentType: "text/plain; charset=utf-8",
          url: oj.gWSUrl() + "alumnos/" + servicio,
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
              self.cancelarNuevaMedicion();
              if (self.botonFormularioMedicion() === "Agregar") {
                alert('Agregado correctamente.');
              } else {
                alert('Guardado correctamente.');
              }
            }
          }
        }).fail(function () {
          document.getElementById('dialogoCargando').close();
          alert("Error en el servidor, favor de comunicarse con el administrador.");
          return;
        });
      };

      self.crearNuevoAlumno = function () {
        var campoId = document.getElementById("nuevoIdAlumno");
        var campoNombre = document.getElementById("nuevoNombreAlumno");
        var campoApellidoP = document.getElementById("nuevoApellidoPAlumno");
        var campoApellidoM = document.getElementById("nuevoApellidoMAlumno");
        var campoFechaNac = document.getElementById("nuevoFNacimientoAlumno");

        if (self.nuevoGrupoAlumno() === -1 || self.nuevoGrupoAlumno() === null || self.nuevoGrupoAlumno() === undefined) {
          alert("Favor de seleccionar un grupo.");
          return;
        }

        campoId.validate();
        campoNombre.validate();
        campoApellidoP.validate();
        campoApellidoM.validate();
        campoFechaNac.validate();

        if (campoId.valid === 'invalidShown' || campoNombre.valid === 'invalidShown' ||
          campoApellidoP.valid === 'invalidShown' || campoApellidoM.valid === 'invalidShown' ||
          campoFechaNac.valid === 'invalidShown') {
          return;
        }

        document.getElementById('dialogoCargando').open();

        var bodyRequest = {
          id_alumno: self.idNuevoAlumno(),
          nombre: self.nombreNuevoAlumno().toUpperCase(),
          apellido_p: self.apellidoPNuevoAlumno().toUpperCase(),
          apellido_m: self.apellidoMNuevoAlumno().toUpperCase(),
          sexo: self.sexoNuevoAlumno(),
          fecha_nac: self.fNacimientoNuevoAlumno(),
          id_grupo: self.nuevoGrupoAlumno().toString()
        };

        var servicio = self.botonFormularioAlumno() === 'Agregar' ?
          'agregarAlumno' :
          'actualizarAlumno';

        $.ajax({
          type: "POST",
          contentType: "text/plain; charset=utf-8",
          url: oj.gWSUrl() + "alumnos/" + servicio,
          dataType: "text",
          data: JSON.stringify(bodyRequest).replace(/]|[[]/g, ''),
          async: true,
          success: function (data) {
            json = JSON.parse(data);
            if (json.hasOwnProperty("error")) {
              document.getElementById('dialogoCargando').close();
              alert('Error, por favor revisa tus datos.');
              return;
            } else {
              document.getElementById("num-alumno").value = self.idNuevoAlumno();
              self.obtenerInfo();
              document.getElementById('dialogoCargando').close();
              self.cancelarNuevoAlumno();
              if(self.botonFormularioAlumno() === 'Guardar') {                                
                alert('Guardado correctamente.');
            } else {
                alert('Agregado correctamente.');
            }
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
        if(self.alumnoSeleccionado() === undefined || self.alumnoSeleccionado() === null || Object.keys(datosAlumnoActual).length === 0) {
          alert("Favor de seleccionar un alumno.");
          return;
        }
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
