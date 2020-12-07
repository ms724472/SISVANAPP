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
      var datosMasivos = {};
      var medicionesAlumnoActual = [];
      var numeroDeMedida = 0;
      var medicionesExistentes = [];
      var consultaInsertarAlumno = "INSERT INTO alumnos(id_alumno, nombre, apellido_p, apellido_m, sexo, fecha_nac, id_grupo) VALUES(?,?,?,?,?,?,?)";
      var consultaInsertarMedicion = "INSERT INTO datos(id_alumno, id_grupo, fecha, masa, diagnostico_peso, z_peso, estatura,  diagnostico_talla, z_talla, imc, diagnostico_imc, z_imc, perimetro_cuello, cintura, triceps, subescapula, pliegue_cuello) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
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
      self.deshabilitarFecha = ko.observable(false);
      self.tituloEliminacion = ko.observable();
      self.mensajeEliminacion = ko.observable();      

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
        console.log("Error en la base de datos: " + error.message);
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
          var diferencia = self.diferenciaMeses(fechaIngreso, hoy, false)/12;
          var grado = Math.ceil(diferencia);
          if(grado <= 6 && grado >= 1) {
            var grupoBD = {};
            grupoBD.value = resultados.rows.item(indiceFila).id_grupo;
            grupoBD.label = grado + " " + resultados.rows.item(indiceFila).letra;
            gruposEscuelaActual.push(grupoBD);
          }
          
          if(indiceFila === numFilas-1) {
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

      self.obtenerGruposServidor = function () {
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
        peticionGrupos.send();
      }     

      self.obtenerEscuelasServidor = function() {
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
              self.obtenerGruposServidor();
            }
          }
        }).fail(function () {
          alert("Error en el servidor, favor de comunicarse con el administrador.");
          return;
        });
      }

      if(!oj.gOfflineMode()) {
        self.obtenerEscuelasServidor();
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

      self.obtenerEstadisticas = function (tipo, sexo, historicoAlumno, meses) {        
        var estadisticasJSON = [];
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
        oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql(consultaEstadisticas, [sexo], function (transaccion, resultados) {
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
                
                if(meses.includes(mes) === true) {
                  estadisticasJSON.push(historicoAlumno[meses.indexOf(mes)]);
                  idEstadistica++;
                }
              }

              if(indice === contador-2) {
                switch(tipo) {
                  case "imc":
                    self.datosIMC(new oj.ArrayDataProvider(estadisticasJSON));
                    break;
                  case "talla":
                    self.datosEstatura(new oj.ArrayDataProvider(estadisticasJSON));
                    break;
                  case "peso":
                    self.datosPeso(new oj.ArrayDataProvider(estadisticasJSON));
                    break;
                }
              }              
            }
          }, function (transaccion, error) {
            alert("Problemas con la aplicación, por favor reiniciala: " + error.code);
          });
        });
      };

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
            campo["valor"] = campo["valor"].replace("-E", "").replace("-M", "");
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
              objMedicion.innerText = medicion[llave].replace("-E", "").replace("-M", "");
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
        var listaMediciones = document.getElementById("listaMediciones"); 
        if (listaMediciones !== undefined && listaMediciones !== null) {
          listaMediciones.remove();
        }
              
        medicionesExistentes = [];
        var numFilas = resultados.rows.length;

        if(numFilas === 0) {
          return;
        }

        var jsonMediciones = [];
        var historicoContador = 0;
        var historicoIMC = [];  
        var historicoTalla = []; 
        var pesoContador = 0;
        var historicoPeso = [];      
        var listaMeses = [];
        for (var indiceFila = 0; indiceFila < numFilas; indiceFila++) {
          var fila = resultados.rows.item(indiceFila);
          var compFecha = fila.fecha.split("-");  
          var compFechaNac = fila.fecha_nac.split("-");  
          var fechaMedicion = new Date(compFecha[0], compFecha[1], compFecha[2]); 
          var fechaNac = new Date(compFechaNac[0], compFechaNac[1], compFechaNac[2]); 
          var meses = self.diferenciaMeses(fechaNac, fechaMedicion, false);     
          listaMeses.push(meses);   
          var gruposEscuela = grupos[fila.id_escuela.toString()];
          var grupo = "";
          gruposEscuela.some(function(grupoActual) {
            if(grupoActual.value === fila.id_grupo) {
              grupo = grupoActual.label;
              return true;
            }
          });

          if(fila.diagnostico_peso.endsWith("-M") || fila.diagnostico_peso.endsWith("-E")) {
            medicionesExistentes.push(fila.fecha + fila.meses);
          }

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
            pliegue_cuello: fila.pliegue_cuello,
            id_grupo: fila.id_grupo
          };
          jsonMediciones.push(medicionActual);

          var actualIMC = {
            id: historicoContador,
            serie: "imc",
            mes: meses,
            valor: fila.imc
          };

          historicoIMC.push(actualIMC);

          var actualTalla = {
            id: historicoContador,
            serie: "talla",
            mes: meses,
            valor: fila.estatura
          };

          historicoTalla.push(actualTalla);

          if(fila.diagnostico_peso !== "") {
            var actualPeso = {
              id: pesoContador,
              serie: "peso",
              mes: meses,
              valor: fila.masa
            };
            historicoPeso.push(actualPeso);
          }
        }
        self.procesarMediciones(jsonMediciones);

        if(jsonMediciones.length === 0) {
          self.obtenerEstadisticas("imc", datosAlumnoActual.sexo.toLowerCase(), [], []);
          self.obtenerEstadisticas("talla", datosAlumnoActual.sexo.toLowerCase(), [], []);
          self.obtenerEstadisticas("peso", datosAlumnoActual.sexo.toLowerCase(), [], []);
        } else {
          self.obtenerEstadisticas("imc", datosAlumnoActual.sexo.toLowerCase(), historicoIMC, listaMeses);
          self.obtenerEstadisticas("talla", datosAlumnoActual.sexo.toLowerCase(), historicoTalla, listaMeses);
          self.obtenerEstadisticas("peso", datosAlumnoActual.sexo.toLowerCase(), historicoPeso, listaMeses);
        }
      }

      function procesarDatosDB(transaccion, resultados) {
        var numFilas = resultados.rows.length;
        if(numFilas === 0) {
          alert("Favor de seleccionar un alumno válido.");
          return;
        }

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

          var escuelaLocal;
          
          self.origenDatosEscuelas().data.some(function(escuelaAlumno){
            if(fila.id_escuela === escuelaAlumno.value) {
              escuelaLocal = escuelaAlumno.label;
              return true;
            }
          });       
          
          var datosJSON = {
            nombre: fila.nombre,
            apellido_p: fila.apellido_p,
            apellido_m: fila.apellido_m,
            sexo: fila.sexo.toUpperCase(),
            fecha_nac: compFecha[2] + "/" + compFecha[1] + "/" + compFecha[0],
            escuela: escuelaLocal,
            grado: grado,
            grupo: grupo,
            id_grupo: fila.id_grupo,
            id_escuela: fila.id_escuela
          };
          self.procesarDatos(datosJSON);
        }

        oj.gConexionDB().transaction(function(transaccion) {
          transaccion.executeSql("SELECT datos.*, grupos.id_escuela, grupos.id_grupo, alumnos.fecha_nac FROM datos INNER JOIN alumnos ON datos.id_alumno = alumnos.id_alumno INNER JOIN grupos ON alumnos.id_grupo = grupos.id_grupo WHERE datos.id_alumno = ?",
          [self.idAlumno()], procesarMedicionesDB, manejarErrores);            
        }, function(error){
            alert("Error durante la inicialización, intente reiniciando la aplicación, si la falla persiste contecte al soporte técnico.");
            console.log("Error en la base de datos: " + error.message);
        });
      }

      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.
      self.obtenerInfo = function () {
        if (oj.gOfflineMode() !== true) {
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
                if (json.error === "No hay datos.") {
                  var listaMediciones = document.getElementById("listaMediciones");
                  if (listaMediciones !== undefined && listaMediciones !== null) {
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
                      switch (medicionActual) {
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
                    switch (medicionActual) {
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
        } else {
          oj.gConexionDB().transaction(function (transaccion) {
            transaccion.executeSql("SELECT alumnos.*, grupos.id_escuela FROM alumnos INNER JOIN grupos ON alumnos.id_grupo = grupos.id_grupo WHERE id_alumno = ?",
              [self.idAlumno()], procesarDatosDB, manejarErrores);
          }, function (error) {
            alert("Error durante la inicialización, intente reiniciando la aplicación, si la falla persiste contecte al soporte técnico.");
            console.log("Error en la base de datos: " + error.message);
          });
        }

        document.getElementById('datosAlumno').expanded = 'true';
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
+
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

                    document.getElementById('dialogoSincronizacion').close();
                  });
                });
              }
            }
          }
          peticionAlumnos.send();
        } 
      }

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

      function procesarMedicionesActualizar(transaccion, resultados) {
        var numFilas = resultados.rows.length;
        for (var indiceFila = 0; indiceFila < numFilas; indiceFila++) {
          var fila = resultados.rows.item(indiceFila);
          var medicionActualizar = {
            idGrupo : fila.id_grupo.toString(),
            peso: fila.masa.toString(),
            dxPeso: fila.diagnostico_peso.replace("-M", ""),
            zPeso: fila.z_peso.toString(),
            talla: fila.estatura.toString(),
            dxTalla: fila.diagnostico_talla,
            zTalla: fila.z_talla.toString(),
            dxIMC: fila.diagnostico_imc,
            zIMc: fila.z_imc.toString(),
            perCuello: fila.perimetro_cuello.toString(),
            cintura: fila.cintura.toString(),
            triceps: fila.triceps.toString(),
            subescapula: fila.subescapula.toString(),
            pliegue_cuello: fila.pliegue_cuello.toString(),
            idAlumno: fila.id_alumno.toString(),
            fecha: fila.fecha
          };
          datosMasivos.datosActualizar.push(medicionActualizar);
        }

        var peticionSubirDatos = new XMLHttpRequest();
        peticionSubirDatos.open("POST", oj.gWSUrl() + "sincronizarDatosMasivos", true);
        peticionSubirDatos.onreadystatechange = function () {
          if (this.readyState === 4) {
            if (this.status === 200) {
              alert("Sincronización completada existosamente.");
              self.evitarCiclo(true)
              oj.gOfflineMode(false);
              self.obtenerEscuelasServidor();
              document.getElementById('dialogoSincronizacion').close();
            } else if(this.status === 406) {
              document.getElementById("dialogoErrorSincronizacion").open();
            }else {
              alert("Error durante la sincronización masiva de datos, por favor intente nuevamente.");
            }
            document.getElementById('dialogoCargando').close();
          }
        };
        peticionSubirDatos.send(JSON.stringify(datosMasivos));
      }

      self.aceptarError = function() {
        document.getElementById("dialogoErrorSincronizacion").close();
      }

      function procesarMedicionesInsertar(transaccion, resultados) {
        var consultaDatos = "SELECT * FROM datos WHERE diagnostico_peso like '%-M'";
        var numFilas = resultados.rows.length;
        for (var indiceFila = 0; indiceFila < numFilas; indiceFila++) {
          var fila = resultados.rows.item(indiceFila);
          var medicionInsertar = {            
            idAlumno: fila.id_alumno.toString(),
            idGrupo : fila.id_grupo.toString(),           
            fecha: fila.fecha,
            peso: fila.masa.toString(),
            dxPeso: fila.diagnostico_peso,
            zPeso: fila.z_peso.toString(),
            talla: fila.estatura.toString(),
            dxTalla: fila.diagnostico_talla,
            zTalla: fila.z_talla.toString(),
            dxIMC: fila.diagnostico_imc,
            zIMc: fila.z_imc.toString(),
            perCuello: fila.perimetro_cuello.toString(),
            cintura: fila.cintura.toString(),
            triceps: fila.triceps.toString(),
            subescapula: fila.subescapula.toString(),
            pliegue_cuello: fila.pliegue_cuello.toString()
          };
          datosMasivos.datosInsertar.push(medicionInsertar);
        }
       
        oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql(consultaDatos,
            [], procesarMedicionesActualizar, manejarErrores);
        }, function (error) {
          alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
          console.log("Error en la base de datos: " + error.message);
          return;
        });
      }

      function procesarAlumnosActualizar(transaccion, resultados) {
        var numFilas = resultados.rows.length;
        for (var indiceFila = 0; indiceFila < numFilas; indiceFila++) {
          var fila = resultados.rows.item(indiceFila);
          var alumnoActualizar = {
            nombre: fila.nombre.replace("-M", ""), 
            apellidoP: fila.apellido_p,
            apellidoM: fila.apellido_m,
            sexo: fila.sexo.toLowerCase(),
            fechaNac: fila.fecha_nac,
            idGrupo: fila.id_grupo.toString(),            
            idAlumno: fila.id_alumno.toString()
          };
          datosMasivos.alumnosActualizar.push(alumnoActualizar);
        }
        
        var consultaDatos = "SELECT * FROM datos WHERE diagnostico_peso NOT like '%-M' AND diagnostico_peso NOT like '%-E'";
        oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql(consultaDatos,
            [], procesarMedicionesInsertar, manejarErrores);
        }, function (error) {
          alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
          console.log("Error en la base de datos: " + error.message);
          return;
        });
      }

      function procesarAlumnosAInsertar(transaccion, resultados) {
        var numFilas = resultados.rows.length;
        for (var indiceFila = 0; indiceFila < numFilas; indiceFila++) {
          var fila = resultados.rows.item(indiceFila);
          var alumnoInsertar = {
            idAlumno: fila.id_alumno.toString(),
            nombre: fila.nombre, 
            apellidoP: fila.apellido_p,
            apellidoM: fila.apellido_m,
            sexo: fila.sexo.toLowerCase(),
            fechaNac: fila.fecha_nac,
            idGrupo: fila.id_grupo.toString()
          };
          datosMasivos.alumnosInsertar.push(alumnoInsertar);
        }

        var consultaAlumnos = "SELECT * FROM alumnos WHERE nombre like '%-M'";
        oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql(consultaAlumnos,
            [], procesarAlumnosActualizar, manejarErrores);
        }, function (error) {
          alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
          console.log("Error en la base de datos: " + error.message);
          return;
        });
      }

      self.subirDatos = function() {
        document.getElementById('dialogoCargando').open();
        datosMasivos = {
          alumnosInsertar: [],
          alumnosActualizar: [],
          datosInsertar: [],
          datosActualizar: []
        };
        var consultaAlumnos = "SELECT * FROM alumnos WHERE nombre NOT like '%-E' AND nombre NOT like '%-M'";
        oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql(consultaAlumnos,
            [], procesarAlumnosAInsertar, manejarErrores);
        }, function (error) {
          alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
          console.log("Error en la base de datos: " + error.message);
          return;
        });

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
          document.getElementById("dialogoConectar").open();
        }
      };

      self.conectarServidor = function() {        
        self.obtenerEscuelasServidor();
        self.actualizarBanderDesconexion("no");
        document.getElementById("dialogoConectar").close();
      }

      self.cancelarConexion = function() {        
        self.evitarCiclo(true);
        oj.gOfflineMode(true);
        self.obtenerEscuelasServidor();
        document.getElementById("dialogoConectar").close();
      }

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
        document.getElementById('nombreABuscar').value = '';
        self.origenDatosNombres(new oj.ArrayDataProvider([]));
        document.getElementById('dialogoBuscarAlumno').close();
      };

      self.nuevaMedicion = function () {
        if(self.idAlumno() !== undefined && self.idAlumno() !== "" &&  Object.keys(datosAlumnoActual).length !== 0){
          self.origenDatosGrupos(new oj.ArrayDataProvider(grupos[datosAlumnoActual.id_escuela], { keyAttributes: 'value' }));
          self.nuevoGrupoAlumno(datosAlumnoActual.id_grupo);
          self.tituloDialogoMedicion("Agregar nueva medición");
          self.botonFormularioMedicion("Agregar");
          self.deshabilitarFecha(false);
          document.getElementById('dialogoNuevaMedicion').open();
        } else {
          alert("Selecciona o crea un alumno para agregar una nueva medición.")
        }
      };

      self.editarMedicion = function() {
        var listaMediciones = document.getElementById("listaMediciones");
        if (self.idAlumno() === undefined || self.idAlumno() === null || self.idAlumno() === "" || Object.keys(datosAlumnoActual).length === 0) {
          alert("Favor de seleccionar un alumno");
        } else if(listaMediciones === undefined || listaMediciones === null) {
          alert("Para editar mediciones es necesario tener al menos una.");
        } else {
          var mediciones = listaMediciones.getElementsByClassName("oj-expanded");
          if(mediciones.length < 1) {
            alert("Favor de seleccionar una medición");
          } else {
            self.deshabilitarFecha(true);
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
        var datos = [{ NoData: "" }];

        if(oj.gOfflineMode() !== true) {
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
        } else {
          var consultaAlumno = "SELECT id_alumno, REPLACE(REPLACE(alumnos.nombre, '-E', ''), '-M', '') || ' ' || apellido_p || ' ' || apellido_m as nombre_completo, escuelas.nombre as nombre_escuela,anio_ingreso,letra\n"
            + "FROM alumnos \n"
            + "INNER JOIN grupos ON alumnos.id_grupo = grupos.id_grupo \n"
            + "INNER JOIN escuelas ON grupos.id_escuela = escuelas.id_escuela\n"
            + "WHERE alumnos.nombre like '%" + nombreAlumno + "%' OR apellido_p like '%" + nombreAlumno + "%' OR apellido_m like '%" + nombreAlumno + "%';";
          var listaResultados = [];
          
          oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql(consultaAlumno,
            [], function(transaccion, resultados){
              var numFilas = resultados.rows.length;
              for (var indiceFila = 0; indiceFila < numFilas; indiceFila++) {                
                var fila = resultados.rows.item(indiceFila);
                var hoy = new Date();
                var fechaIngreso = new Date('08/01/' + fila.anio_ingreso);
                var diferencia = self.diferenciaMeses(fechaIngreso, hoy, false)/12;
                var grado = Math.ceil(diferencia);
                var grupo = grado + " " + fila.letra;
                var alumnoEncontrado = {
                  id_alumno: fila.id_alumno,
                  nombre_completo: fila.nombre_completo,
                  nombre_escuela: fila.nombre_escuela,
                  grupo: grupo
                };
                listaResultados.push(alumnoEncontrado);
              }
              self.origenDatosNombres(new oj.ArrayDataProvider(listaResultados, { keyAttributes: 'id_alumno' }));
            }, manejarErrores);
          }, function (error) {
            alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
            console.log("Error en la base de datos: " + error.message);
            return;
          });
        }
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
        self.nombreNuevoAlumno(datosAlumnoActual.nombre.replace("-E", "").replace("-M", ""));
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

      self.calcularPuntajeZ = function (tipo, sexo, meses, valor) {
        return new Promise(function (resolve, reject) {
          if(tipo === "peso" && meses > 120) {
            resolve(undefined);
          } else {
            var puntaje = 0;
            var tabla = "percentiles_oms_" + tipo;
            var consultaEstadisticas = "SELECT normalizador, mediana, coeficiente_variacion \n"
              + "FROM " + tabla + " WHERE id_percentil = ?";

            if(meses < 61) {              
              alert("Favor de revisar la fecha de nacimiento de alumno.");
              reject();
            }

            oj.gConexionDB().transaction(function (transaccion) {
              transaccion.executeSql(consultaEstadisticas, [sexo.toLowerCase() + meses], function (transaccion, resultados) {
                var contador = resultados.rows.length;
                var valor_normalizador;
                var valor_mediana;
                var valor_coeficiente;
                for (var indice = 0; indice < contador; indice++) {
                  var fila = resultados.rows.item(indice);
                  valor_normalizador = parseFloat(fila.normalizador);
                  valor_mediana = parseFloat(fila.mediana);
                  valor_coeficiente = parseFloat(fila.coeficiente_variacion);
                  puntaje = Math.pow(valor / valor_mediana, valor_normalizador) - 1;
                  var divisor = valor_normalizador * valor_coeficiente;
                  puntaje = puntaje / divisor;
                  resolve(puntaje);
                }
              }, function (error) {
                alert("Problemas con la aplicación, por favor reiniciala: " + error.code);
                reject();
              }, manejarErrores);
            });
          }
        });
      };

      self.procesarMedicionBD = function(meses, puntajeIMC, puntajeTalla, puntajePeso, imc) {
        var consultaMedicion = consultaInsertarMedicion;
        var parametros;

        var diagnosticoPeso = "";
        var diagnosticoIMC = "";
        var diagnosticoTalla = puntajeTalla < -2.0 ? "CON TALLA BAJA" : "SIN TALLA BAJA";

        if(puntajePeso !== undefined) {
          diagnosticoPeso = puntajePeso < -2.0 ? "CON PESO BAJO" : "SIN PESO BAJO";
        }

        if(puntajeIMC < -2.0) {
          diagnosticoIMC = "BAJO PESO";
        } else if(puntajeIMC <= 1.0) {
          diagnosticoIMC = "SIN EXCESO DE PESO";          
        } else if(puntajeIMC > 1.0 && puntajeIMC <= 2.0) {
          diagnosticoIMC = "SOBREPESO";
        } else if(puntajeIMC > 2.0) {
          diagnosticoIMC = "OBESIDAD";
        }       

        if(self.botonFormularioMedicion() === "Agregar") {
          parametros = [
            self.idAlumno(),                      
            self.nuevoGrupoAlumno(),                    
            self.fechaMedicion(),
            self.peso(),
            diagnosticoPeso,
            puntajePeso === undefined ? "": puntajePeso.toFixed(5),
            self.talla(),
            diagnosticoTalla,
            puntajeTalla.toFixed(5),
            imc,
            diagnosticoIMC,
            puntajeIMC.toFixed(5),
            self.perCuello(),
            self.cintura(),
            self.triceps(),
            self.subEscapular(),
            self.pliegueCuello()
          ];
        } else {
          medicionesAlumnoActual.some(function (medicionActualAlumno) {
            var compFecha = medicion.fecha.split("/");
            if ((medicionActualAlumno.diagnostico_peso.endsWith("-M") || medicionActualAlumno.diagnostico_peso.endsWith("-E")) && 
                  medicionActualAlumno.fecha === (compFecha[2] + '-' + compFecha[1] + '-' + compFecha[0])) {
              diagnosticoPeso = diagnosticoPeso + "-M";
              return true;
            }
          });

          consultaMedicion = "UPDATE datos SET\n" +
                             "id_grupo = ?,\n" +
                             "masa = ?,\n" +
                             "diagnostico_peso = ?,\n" +
                             "z_peso = ?,\n" + 
                             "estatura = ?,\n" +
                             "diagnostico_talla = ?,\n" +
                             "z_talla = ?,\n" +
                             "imc = ?,\n" +
                             "diagnostico_imc = ?,\n" +
                             "z_imc = ?,\n" + 
                             "perimetro_cuello = ?,\n" +
                             "cintura = ?,\n" +
                             "triceps = ?,\n" +
                             "subescapula = ?,\n" +
                             "pliegue_cuello = ?\n" +
                             "WHERE id_alumno = ?\n" +
                             "AND fecha = ?"; 
          parametros = [                     
            self.nuevoGrupoAlumno(),
            self.peso(),
            medicionesExistentes.includes(self.fechaMedicion() + meses) ? diagnosticoPeso + "-M" : diagnosticoPeso,
            puntajePeso === undefined ? "": puntajePeso.toFixed(5),
            self.talla(),
            diagnosticoTalla,
            puntajeTalla.toFixed(5),
            imc,
            diagnosticoIMC,
            puntajeIMC.toFixed(5),
            self.perCuello(),
            self.cintura(),
            self.triceps(),
            self.subEscapular(),
            self.pliegueCuello(),            
            self.idAlumno(),                    
            self.fechaMedicion()
          ];
        }

        oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql(consultaMedicion,
            parametros, function (transaccion, resultados) {
              self.obtenerInfo();
              document.getElementById('dialogoCargando').close();
              self.cancelarNuevaMedicion();
              if (self.botonFormularioMedicion() === "Agregar") {
                alert('Agregado correctamente.');
              } else {
                alert('Guardado correctamente.');
              }
            }, function (error) {
              document.getElementById('dialogoCargando').close();
              alert("Error durante la insercción de datos, revisa tus datos.");
            });
        }, function (error) {
          alert("Error durante la insercción de datos, intente nuevamente o reinicie la aplicación.");
          console.log("Error en la base de datos: " + error.message);
          return;
        });
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

        if (oj.gOfflineMode() !== true) {
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
        } else {
          var compFechaNac = datosAlumnoActual.fecha_nac.split("/")
          var meses = self.diferenciaMeses(new Date(compFechaNac[2] + "-" + compFechaNac[1] + "-" + compFechaNac[0]), new Date(self.fechaMedicion()), false)
          var imc = self.peso() / (Math.pow(self.talla()/100, 2));          
           
          self.calcularPuntajeZ("imc", datosAlumnoActual.sexo, meses, imc).then(function(puntajeIMC) {
            self.calcularPuntajeZ("talla", datosAlumnoActual.sexo, meses, self.talla()).then(function(puntajeTalla) {
              self.calcularPuntajeZ("peso", datosAlumnoActual.sexo, meses, self.peso()).then(function(puntajePeso) {
                self.procesarMedicionBD(meses, puntajeIMC, puntajeTalla, puntajePeso, imc);
              }).catch(function(error) {
                alert("Error durante el calculo de puntajes, intente nuevamente o reinicie la aplicación.");
                document.getElementById('dialogoCargando').close();
              });
            }).catch(function(error) {
              alert("Error durante el calculo de puntajes, intente nuevamente o reinicie la aplicación.");
              document.getElementById('dialogoCargando').close();
            });  
          }).catch(function(error) {
            alert("Error durante el calculo de puntajes, intente nuevamente o reinicie la aplicación.");
            document.getElementById('dialogoCargando').close();
          });  
        }
      };

      self.eliminarAlumno = function() {
        if (self.idAlumno() === undefined || self.idAlumno() === null || self.idAlumno() === "" || Object.keys(datosAlumnoActual).length === 0) {
          alert("Favor de seleccionar un alumno.");
          return;
        }
        self.tituloEliminacion("Eliminar Alumno");
        self.mensajeEliminacion("Al eliminar un alumno, se eliminarán también todas sus mediciones, esta operación puede corromper la base de datos, ¿desea continuar?");
        document.getElementById("dialogo-notif-eliminacion").open();
      };

      self.eliminarMedicion = function () {
        var listaMediciones = document.getElementById("listaMediciones");
        if (self.idAlumno() === undefined || self.idAlumno() === null || self.idAlumno() === "" || Object.keys(datosAlumnoActual).length === 0) {
          alert("Favor de seleccionar un alumno.");
        } else if (listaMediciones === undefined || listaMediciones === null) {
          alert("Para eliminar mediciones es necesario tener al menos una.");
        } else {
          var mediciones = listaMediciones.getElementsByClassName("oj-expanded");
          if (mediciones.length < 1) {
            alert("Favor de seleccionar una medición");
          }
          else {
            self.tituloEliminacion("Eliminar Medición");
            self.mensajeEliminacion("¿Seguro que desea eliminar esta medida?");
            document.getElementById("dialogo-notif-eliminacion").open();
          }
        }
      };

      self.aceptarEliminacion = function () {
        document.getElementById("dialogo-notif-eliminacion").close();
        document.getElementById('dialogoCargando').open();
        if (self.tituloEliminacion() === "Eliminar Alumno") {
          var consultaEliminarMediciones = "DELETE FROM datos WHERE id_alumno = ?";
          oj.gConexionDB().transaction(function (transaccion) {
            transaccion.executeSql(consultaEliminarMediciones,
              [self.idAlumno()], function () {
                var consultaEliminarAlumno = "DELETE FROM alumnos WHERE id_alumno = ?";
                oj.gConexionDB().transaction(function (transaccion) {
                  transaccion.executeSql(consultaEliminarAlumno,
                    [self.idAlumno()], function () {
                      alert("El alumno ha siso eliminado exitosamente.");
                      self.datosAlumno(new oj.ArrayDataProvider([{NoData: ""}]));
                      self.idAlumno("");
                      var listaMediciones = document.getElementById("listaMediciones");
                      if(listaMediciones !== undefined || listaMediciones !== null) {
                        listaMediciones.innerHTML = "";
                      }
                      self.datosIMC(new oj.ArrayDataProvider([{NoData: ""}]));
                      self.datosEstatura(new oj.ArrayDataProvider([{NoData: ""}]));
                      self.datosPeso(new oj.ArrayDataProvider([{NoData: ""}]));
                      document.getElementById('dialogoCargando').close();
                    }, manejarErrores);
                }, function (error) {
                  alert("Error al alumno, consulte al soporte técnico.");
                  document.getElementById('dialogoCargando').close();
                  console.log(error.message);
                });
              }, manejarErrores);
          }, function (error) {
            alert("Error al eliminar al alumno, consulte al soporte técnico.");
            document.getElementById('dialogoCargando').close();
            console.log(error.message);
          });
        } else {
          var mediciones = document.getElementById("listaMediciones").getElementsByClassName("oj-expanded");
          var fechaMedicion = mediciones[0].firstChild.innerText;
          var compFecha = fechaMedicion.split("/");
          fechaMedicion = (compFecha[2] + '-' + compFecha[1] + '-' + compFecha[0]);
          var consultaEliminarAlumno = "DELETE FROM datos WHERE id_alumno = ? and fecha = ?";
          oj.gConexionDB().transaction(function (transaccion) {
            transaccion.executeSql(consultaEliminarAlumno,
              [self.idAlumno(), fechaMedicion], function () {
                alert("La medición ha siso eliminada exitosamente.");
                document.getElementById('dialogoCargando').close();
                self.obtenerInfo();
              }, manejarErrores);
          }, function (error) {
            alert("Error al eliminar la medición, consulte al soporte técnico.");
            document.getElementById('dialogoCargando').consultaEliminarMediciones();
            console.log(error.message);
          });
        }
      };

      self.cancelarEliminar = function() {
        document.getElementById("dialogo-notif-eliminacion").close();
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

        if (oj.gOfflineMode() !== true) {
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
                if (self.botonFormularioAlumno() === 'Guardar') {
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
        } else {                  
          var parametros;
          var nombre = self.nombreNuevoAlumno().toUpperCase();  
          var consultaBD = "UPDATE alumnos SET \n" +
                           "nombre = ?,\n" +
                           "apellido_p = ?,\n" +                           
                           "apellido_m = ?,\n" +  
                           "sexo = ?,\n" +
                           "fecha_nac = ?,\n" +
                           "id_grupo = ?\n" +
                           "WHERE id_alumno = ?";

          if(self.botonFormularioAlumno() === 'Guardar') {
            if(datosAlumnoActual.nombre.endsWith("-E") || datosAlumnoActual.nombre.endsWith("-M")) {              
              nombre = nombre + "-M";
            }

            parametros = [
              nombre,
              self.apellidoPNuevoAlumno().toUpperCase(),
              self.apellidoMNuevoAlumno().toUpperCase(),
              self.sexoNuevoAlumno(),
              self.fNacimientoNuevoAlumno(),
              self.nuevoGrupoAlumno(),              
              self.idNuevoAlumno(),
            ];
          } else {
            consultaBD = consultaInsertarAlumno;
            parametros = [
              self.idNuevoAlumno(),
              nombre,
              self.apellidoPNuevoAlumno().toUpperCase(),
              self.apellidoMNuevoAlumno().toUpperCase(),
              self.sexoNuevoAlumno(),
              self.fNacimientoNuevoAlumno(),
              self.nuevoGrupoAlumno()
            ];
          }

          oj.gConexionDB().transaction(function (transaccion) {
            transaccion.executeSql(consultaBD,
              parametros, function (transaccion, resultados) {
                document.getElementById("num-alumno").value = self.idNuevoAlumno();
                self.obtenerInfo();
                document.getElementById('dialogoCargando').close();
                self.cancelarNuevoAlumno();
                if (self.botonFormularioAlumno() === 'Guardar') {
                  alert('Guardado correctamente.');
                } else {
                  alert('Agregado correctamente.');
                }
              }, function (error) {
                document.getElementById('dialogoCargando').close();
                alert("Error durante la insercción de datos, revisa tus datos.");
              });
          }, function (error) {
            alert("Error durante la insercción de datos, intente nuevamente o reinicie la aplicación.");
            console.log("Error en la base de datos: " + error.message);
            return;
          });
        }
      };

      self.seleccionarAlumno = function () {
        if(self.alumnoSeleccionado() === undefined || self.alumnoSeleccionado() === null) {
          alert("Favor de seleccionar un alumno.");
          return;
        }
        document.getElementById('num-alumno').value = self.alumnoSeleccionado()._keys.values().next().value;
        document.getElementById('nombreABuscar').value = '';
        self.origenDatosNombres(new oj.ArrayDataProvider([]));
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
