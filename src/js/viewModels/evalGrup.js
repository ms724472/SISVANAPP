/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils', 'ojs/ojselectcombobox', 'ojs/ojvalidation-datetime',
  'ojs/ojarraydataprovider', 'ojs/ojchart', 'ojs/ojswitcher', 'ojs/ojdialog', 'ojs/ojdatetimepicker', 'ojs/ojselectsingle'],
  function (oj, ko, app, moduleUtils, accUtils) {
    function ModeloEvaluacionesGrupales() {
      var self = this;
      self.origenDatosEscuelas = ko.observable();
      self.escuelaAEvaluar = ko.observable();
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
      var escuelas = [];
      self.estiloGraficos = ko.observable({"fontSize":"15px"});
      self.tituloGraficoGrupal = ko.observable();
      self.sinGrupos = ko.observable(false);
      self.origenDatosHistorico = ko.observable();
      self.tituloGrafico = ko.observable();

      self.convertidorFechas = ko.observable(oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).
        createConverter(
          {
            pattern: "dd/MM/yyyy"
          }));

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
                      escuelas = respuestaJSON.escuelas;
                      self.origenDatosEscuelas(new oj.ArrayDataProvider(respuestaJSON.escuelas, { keyAttributes: 'value' }));
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
              self.origenDatosGrupos(new oj.ArrayDataProvider(todosLosGrupos[escuelas[0].value]));
            }
          }
        };
        peticionGrupos.send();
      };

      self.cambioEscuela = function (event) {    
        if(Object.keys(todosLosGrupos).length === 0) {
          return;
        } 
        
        self.origenDatosEscuelas().data.some(function(escuela) {
          if(escuela.value === event.target.value) {
            nombreEscuelaSeleccionada = escuela.label;
            return true;
          }
        });
        escuelaSeleccionada = event.target.value;
        grupoSeleccionado = "";
        if (todosLosGrupos.hasOwnProperty(event.target.value)) {
          console.log("TEST");
          self.origenDatosGrupos(new oj.ArrayDataProvider(todosLosGrupos[event.target.value]));
          self.sinGrupos(false);
        } else {
          self.origenDatosGrupos(new oj.ArrayDataProvider([{"value":-1,"label":"Sin grupos"}]));
          self.sinGrupos(true);
        }
        self.grupoSeleccionado(null);
      };

      self.funcionTecho = function (desde) {
        var fecha = new Date(desde() + "T12:00:00");
        var fechaHasta;

        if(isNaN(fecha.getFullYear())){
          return new Date().toISOString();
        }

        if (fecha.getMonth() >= 7 && fecha.getMonth() <= 11) {
          var anio = fecha.getFullYear() + 1;
          fechaHasta = anio + '-' + '07-31';
        } else {
          fechaHasta = fecha.getFullYear() + '-' + '07-31';
        }

        self.valorHasta(fechaHasta);
        return fechaHasta;
      };

      self.corregirNombreSerie = function(serie) {
        var nuevoNombre = "";
        var partesNombre = serie.split("_");
        partesNombre.forEach(function callback(currentValue, index, array) {
            nuevoNombre = nuevoNombre + " " + currentValue.substring(0, 1).toUpperCase() + currentValue.substring(1);            
        });   
        return nuevoNombre.substring(1);             
      };
      
      function manejarErrores(error) {
        alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
        console.log("Error en la base de datos: " + JSON.stringify(error));
      }

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

      self.obtenerHistoricoEscolarBD = function(idEscuela, diagnostico) {
        var prefijoQuery;
        var columnasEvolucion;
        switch(diagnostico) {
            case "talla":
                prefijoQuery = "SELECT fecha, SUM(IIF(diagnostico_talla = \"CON TALLA BAJA\", 1, 0)) AS con_talla_baja,  SUM(IIF(diagnostico_talla = \"SIN TALLA BAJA\", 1, 0)) AS sin_talla_baja\n";
                columnasEvolucion = ["con_talla_baja", "sin_talla_baja"];
                break;
            case "peso":
                prefijoQuery = "SELECT fecha, SUM(IIF(REPLACE(REPLACE(diagnostico_peso, '-E', ''), '-M', '') = \"CON PESO BAJO\", 1, 0)) AS con_peso_bajo,  SUM(IIF(REPLACE(REPLACE(diagnostico_peso, '-E', ''), '-M', '') = \"SIN PESO BAJO\", 1, 0)) AS sin_peso_bajo\n";
                columnasEvolucion = ["con_peso_bajo", "sin_peso_bajo"];
                break;
            default:
                prefijoQuery = "SELECT fecha, SUM(IIF(diagnostico_imc = \"BAJO PESO\", 1, 0)) AS bajo_peso, SUM(IIF(diagnostico_imc = \"SIN EXCESO DE PESO\", 1, 0)) AS sin_exceso_de_peso, SUM(IIF(diagnostico_imc = \"OBESIDAD\", 1, 0)) AS obesidad, SUM(IIF(diagnostico_imc = \"SOBREPESO\", 1, 0)) AS sobrepeso\n";
                columnasEvolucion = ["bajo_peso", "sin_exceso_de_peso", "obesidad", "sobrepeso"];
                break;
        }
        
        var query = prefijoQuery
          + "FROM datos INNER JOIN grupos ON datos.id_grupo = grupos.id_grupo\n"
          + "WHERE id_escuela = ?\n"
          + "GROUP BY fecha ORDER BY fecha";

        oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql(query,
            [idEscuela], function (transaccion, resultados) {
              var numFilas = resultados.rows.length;
              var jsonDatos = [];
              var indiceEstadisticas = 0;

              for (var indiceFila = 0; indiceFila < numFilas; indiceFila++) {
                var fila = resultados.rows.item(indiceFila);
                
                columnasEvolucion.forEach(function(columna){
                  var percentil = {
                    id: indiceEstadisticas,
                    serie: columna,
                    fecha: fila.fecha,
                    valor: fila[columna]
                  };
                  jsonDatos.push(percentil);
                  indiceEstadisticas++;
                });                
              }

              self.origenDatosHistorico(new oj.ArrayDataProvider(jsonDatos, { keyAttributes: 'id' }));
              self.tituloGrafico("PRIMARIA " + nombreEscuelaSeleccionada);
            }, manejarErrores);
        }, function (error) {
          alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
          console.log("Error en la base de datos: " + error.message);
        });              
      }

      self.obtenerPorcentajesEscolaresBD = function(idEscuela, diagnostico) {
        var columnaDiagnostico = diagnostico === "talla" ? "diagnostico_talla" : diagnostico === "peso" ? "diagnostico_peso" : "diagnostico_imc";

        var query = "SELECT 'Escuela ' || nombre_escuela as escuela, diagnostico, COUNT(*) as value\n"
        + "FROM (SELECT escuelas.nombre as nombre_escuela, d." + columnaDiagnostico + " as diagnostico\n"
        + "FROM datos d\n"
        + "INNER JOIN alumnos ON alumnos.id_alumno = d.id_alumno\n"
        + "INNER JOIN grupos ON grupos.id_grupo = alumnos.id_grupo\n"
        + "INNER JOIN escuelas ON escuelas.id_escuela = grupos.id_escuela\n"
        + "WHERE d.fecha between ?  and ?\n"
        + "AND d.id_grupo IN (SELECT id_grupo FROM grupos WHERE id_escuela = ?)) subdatos\n"
        + "GROUP BY diagnostico";

        oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql(query,
            [self.valorDesde(), self.valorHasta(), idEscuela], function(transaccion, resultados) {
              var numFilas = resultados.rows.length;
              var jsonDatos = [];

              for (var indiceFila = 0; indiceFila < numFilas; indiceFila++) {
                var fila = resultados.rows.item(indiceFila);
                var diagnostico = fila.diagnostico.replace("-E", "").replace("-M", "");
                var percentil = {
                  id: indiceFila,
                  serie: diagnostico === "" ? "NO APLICABLE" : diagnostico,
                  escuela: fila.escuela,
                  valor: fila.value
                };
                jsonDatos.push(percentil);
              }
              
              self.porcentajesEscuelas(new oj.ArrayDataProvider(jsonDatos));
              self.tituloGraficoEscolar("PRIMARIA " + nombreEscuelaSeleccionada);
            }, manejarErrores);
        }, function (error) {
          alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
          console.log("Error en la base de datos: " + error.message);
        });
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

      self.obtenerPorcentajesGrupalesBD = function(idGrupo, diagnostico) {
        var columnaDiagnostico = diagnostico === "talla" ? "diagnostico_talla" : diagnostico === "peso" ? "diagnostico_peso" : "diagnostico_imc";

        var query = "SELECT 'Grupo ' || id_grupo as grupo, diagnostico, COUNT(*) as value \n"
        + "FROM (SELECT alumnos.id_grupo, d." + columnaDiagnostico + " as diagnostico FROM datos d INNER JOIN alumnos\n"
        + "ON alumnos.id_alumno = d.id_alumno\n"
        + "WHERE d.fecha between ? and ? AND d.id_grupo = ?) subdatos\n"
        + "GROUP BY diagnostico;";

        oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql(query,
            [self.valorDesde(), self.valorHasta(), idGrupo], function(transaccion, resultados) {
              var numFilas = resultados.rows.length;
              var jsonDatos = [];

              for (var indiceFila = 0; indiceFila < numFilas; indiceFila++) {
                var fila = resultados.rows.item(indiceFila);
                var diagnostico = fila.diagnostico.replace("-E", "").replace("-M", "");
                var percentil = {
                  id: indiceFila,
                  serie: diagnostico === "" ? "NO APLICABLE" : diagnostico,
                  grupo: fila.grupo,
                  valor: fila.value
                };
                jsonDatos.push(percentil);
              }
              
              self.porcentajesGrupos(new oj.ArrayDataProvider(jsonDatos));
              self.tituloGraficoGrupal("PRIMARIA " + nombreEscuelaSeleccionada + " GRUPO " + etiquetaGrupoSeleccionado);              
            }, manejarErrores);
        }, function (error) {
          alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
          console.log("Error en la base de datos: " + error.message);
        });
      };

      self.obtenerHistoricoEscolar = function (idEscuela, diagnostico) {
        var servicio = "escolares/obtenerHistoricoEscuela/" + diagnostico + "/" + idEscuela;

        var peticionHistoricoEscolares = new XMLHttpRequest();
        peticionHistoricoEscolares.open("GET", oj.gWSUrl() + servicio, false);
        peticionHistoricoEscolares.onreadystatechange = function () {
          if (this.readyState === 4) {
            if (this.status === 200) {
              var respuestaJSON = JSON.parse(this.responseText);
              if (respuestaJSON.hasOwnProperty("error")) {
                if (respuestaJSON.error === "No hay datos.") {
                  self.origenDatosHistorico(new oj.ArrayDataProvider([{ NoData: "" }]));
                } else {
                  alert(ERROR_INTERNO_SERVIDOR);
                }
              } else {
                self.origenDatosHistorico(new oj.ArrayDataProvider(respuestaJSON.mediciones, { keyAttributes: 'id' }));
                self.tituloGrafico("PRIMARIA " + nombreEscuelaSeleccionada);
              }
            } else {
              alert(ERROR_INTERNO_SERVIDOR);
            }
          }
        };
        peticionHistoricoEscolares.send();
      }

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

      function procesarGrupos(transaccion, resultados) {
        var numFilas = resultados.rows.length;
        
        var gruposEscuelaActual = [];
        var idEscuelaActual;

        for (var indiceFila = 0; indiceFila < numFilas; indiceFila++) {
          if(indiceFila === 0) {
            idEscuelaActual = resultados.rows.item(indiceFila).id_escuela;
          } else if(resultados.rows.item(indiceFila).id_escuela !== idEscuelaActual) {
            grupos[idEscuelaActual] = gruposEscuelaActual;
            gruposEscuelaActual = [];
            idEscuelaActual = resultados.rows.item(indiceFila).id_escuela;
          }
          
          var fechaHasta = new Date(self.valorHasta());
          var fechaIngreso = new Date('08/01/' + resultados.rows.item(indiceFila).anio_ingreso);
          var diferencia = self.diferenciaMeses(fechaIngreso, fechaHasta, false)/12;
          var grado = Math.ceil(diferencia);
          
          if(grado <= 6 && grado >= 1) {
            var grupoBD = {
              value: resultados.rows.item(indiceFila).id_grupo,
              label: grado + " " + resultados.rows.item(indiceFila).letra
            };
            gruposEscuelaActual.push(grupoBD);
          }
          
          if(indiceFila === numFilas-2) {
            todosLosGrupos[idEscuelaActual] = gruposEscuelaActual;
          }
        }         
        
        nombreEscuelaSeleccionada = escuelas[0].label;
        etiquetaGrupoSeleccionado = todosLosGrupos[escuelas[0].value][0].label;

        self.origenDatosGrupos(new oj.ArrayDataProvider(todosLosGrupos[escuelas[0].value], { keyAttributes: 'value' }));
        self.grupoSeleccionado(todosLosGrupos[escuelas[0].value][0].value);

        self.obtenerPorcentajesEscolaresBD(escuelas[0].value, "imc");
        self.obtenerPorcentajesGrupalesBD(todosLosGrupos[escuelas[0].value][0].value, "imc");  
        self.obtenerHistoricoEscolarBD(escuelas[0].value, "imc");             
      }

      function procesarEscuelas(transaccion, resultados) {        
        var numFilas = resultados.rows.length;

        for (var indiceFila = 0; indiceFila < numFilas; indiceFila++) {
          var escuelaDB = {
            value: resultados.rows.item(indiceFila).id_escuela,
            label: resultados.rows.item(indiceFila).nombre
          };
          escuelas.push(escuelaDB);   
        }

        self.origenDatosEscuelas(new oj.ArrayDataProvider(escuelas, { keyAttributes: 'value' }));
        self.escuelaAEvaluar(escuelas[0].value);

        var consultaGrupos = "SELECT * FROM grupos";
        oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql(consultaGrupos,
            [], procesarGrupos, manejarErrores);
        }, function (error) {
          alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
          console.log("Error en la base de datos: " + error.message);
        });
      }

      self.obtenerEvaluaciones = function(desde, hasta) {
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
        
        if(!oj.gOfflineMode()) {
          self.obtenerLasEscuelas();
          self.obtenerTodosLosGrupos();
          nombreEscuelaSeleccionada = escuelas[0].label;
          self.obtenerPorcentajesEscolares(escuelas[0].value, "imc");
          self.obtenerHistoricoEscolar(escuelas[0].value, "imc");
          etiquetaGrupoSeleccionado = todosLosGrupos[escuelas[0].value][0].label;
          self.obtenerPorcentajesGrupales(todosLosGrupos[escuelas[0].value][0].value, "imc");
        } else {
          var consultaEscuelas = "SELECT * FROM escuelas ORDER BY id_escuela";
          oj.gConexionDB().transaction(function (transaccion) {
            transaccion.executeSql(consultaEscuelas,
              [], procesarEscuelas, manejarErrores);
          }, function (error) {
            alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
            console.log("Error en la base de datos: " + error.message);
          });
        }
      }; 

      self.obtenerRangos = function () {
        if (oj.gOfflineMode() === true) {
          var consultaRangos = "SELECT MAX(fecha) as desde, grupos.id_grupo FROM datos INNER JOIN grupos ON grupos.id_grupo = datos.id_grupo INNER JOIN escuelas ON grupos.id_escuela = escuelas.id_escuela  WHERE escuelas.id_escuela = (SELECT MIN(id_escuela) FROM escuelas)";
          oj.gConexionDB().transaction(function (transaccion) {
            transaccion.executeSql(consultaRangos,
              [], function(transaccion, resultados) {
                var numFilas = resultados.rows.length;
                var desde;
                var hasta;
                for (var indiceFila = 0; indiceFila < numFilas; indiceFila++) {
                  fila = resultados.rows.item(indiceFila);
                  desde = fila.desde;        
                } 
                if (desde !== undefined && desde !== null) {
                  var fechaDesde = new Date(desde);
                  if (fechaDesde.getMonth() >= 7 && fechaDesde.getMonth() <= 11) {
                    hasta = (fechaDesde.getFullYear() + 1) + "-07-31";
                  } else {
                    hasta = fechaDesde.getFullYear() + "-07-31";
                  }

                  self.obtenerEvaluaciones(desde, hasta);
                } else {
                  self.obtenerEvaluaciones("", "");
                }                                                     
              }, manejarErrores);
          }, function (error) {
            alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
            console.log("Error en la base de datos: " + error.message);
            return;
          });
        } else {
          var peticionRangos = new XMLHttpRequest();
          peticionRangos.open("GET", oj.gWSUrl() + "obtenerRangos", false);
          peticionRangos.onreadystatechange = function () {
            if (this.readyState === 4) {
              if (this.status === 200) {
                var respuestaJSON = JSON.parse(this.responseText);
                var desde = respuestaJSON.rangos[0].desde;
                var hasta = respuestaJSON.rangos[0].hasta;
                self.obtenerEvaluaciones(desde, hasta);
              } else {
                alert("Error cargando ultimas mediciones, favor de contactar al administrador.")
              }
            }
          };

          peticionRangos.send();
        }
      };

      self.obtenerRangos();      

      self.actualizarGraficos = function (event) {
        if(oj.gOfflineMode() === true) {
          self.obtenerPorcentajesEscolaresBD(self.escuelaAEvaluar(), self.tipoEvalSeleccionada());
          self.obtenerPorcentajesGrupalesBD(self.grupoSeleccionado(), self.tipoEvalSeleccionada());
          self.obtenerHistoricoEscolarBD(self.escuelaAEvaluar(), self.tipoEvalSeleccionada());
        } else {
          self.obtenerPorcentajesEscolares(self.escuelaAEvaluar(), self.tipoEvalSeleccionada());
          self.obtenerPorcentajesGrupales(self.grupoSeleccionado(), self.tipoEvalSeleccionada());
          self.obtenerHistoricoEscolar(self.escuelaAEvaluar(), self.tipoEvalSeleccionada());
        }        
        self.cerrarDialogo();
      };      

      self.actualizarEtiqueta = function(event) {
        self.origenDatosGrupos().data.some(function(grupo) {
          if(grupo.value === event.target.value) {
            etiquetaGrupoSeleccionado = grupo.label;
            return true;
          }
        });        
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
        createPDFRequest.open('POST', oj.gWSUrl() + "generarImagen", true);
        createPDFRequest.responseType = "arraybuffer";
        createPDFRequest.onreadystatechange = function () {
          if (this.readyState == 4) {
            if (this.status == 200) {
              var blob = new Blob([this.response], { type: "image/png" });
              oj.gGuardarArchivos("Reporte.png", blob);
            
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
