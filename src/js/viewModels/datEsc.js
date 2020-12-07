/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/*
 * Your profile ViewModel code goes here
 */
define(['knockout', 'jquery', 'appController', 'ojs/ojmodule-element-utils', 'accUtils', 'ojs/ojarraydataprovider', 'ojs/ojaccordion',
  'ojs/ojbutton', 'ojs/ojlistview', 'ojs/ojlistitemlayout', 'ojs/ojtoolbar', 'ojs/ojdialog', 'ojs/ojinputtext', 
  'ojs/ojselectcombobox', 'ojs/ojdatetimepicker', 'ojs/ojvalidation-datetime', ],
  function (ko, $, app, moduleUtils, accUtils, ArrayDataProvider) {

    function ModeloDatosEscolares() {
      var self = this;
      var todasLasEscuelas = [];
      var todosLosGrupos = {};
      var escuelaActual = {};
      self.datosMunicipios = ko.observable();
      self.campoCCT = ko.observable();
      self.campoNombre = ko.observable();
      self.campoDireccion = ko.observable();
      self.campoColonia = ko.observable();
      self.campoCodigoPostal = ko.observable();
      self.campoTelefono = ko.observable();
      self.campoEstado = ko.observable();
      self.campoMunicipio = ko.observable();
      self.tituloDialogoEscuela = ko.observable("Agregar nueva escuela");
      self.botonDialogoEscuela = ko.observable("Agregar");
      self.tituloDialogoGrupo = ko.observable("Agregar nuevo grupo");
      self.botonDialogoGrupo = ko.observable("Agregar");
      self.fechaToma = ko.observable();
      self.campoGrado = ko.observable();
      self.campoLetra = ko.observable();
      self.grupoSeleccionado = ko.observable();
      self.tituloNotificacionGrupo = ko.observable();
      self.mensajeGrupo = ko.observable();
      self.grupoFinal = ko.observable();
      self.ocultarCancelar = ko.observable(true);

      self.grados = [
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
        { value: 5 },
        { value: 6 }
      ];

      self.estados = [
        { value: 'JALISCO' }
      ];

      self.datosEstados = new ArrayDataProvider(self.estados, { keyAttributes: 'value' });

      self.municipios = {
        JALISCO: [
          { value: 'ACATIC' },
          { value: 'ACATLAN DE JUAREZ' },
          { value: 'AHUALULCO DE MERCADO' },
          { value: 'AMACUECA' },
          { value: 'AMATITAN' },
          { value: 'AMECA' },
          { value: 'ARANDAS' },
          { value: 'ATEMAJAC DE BRIZUELA' },
          { value: 'ATENGO' },
          { value: 'ATENGUILLO' },
          { value: 'ATOTONILCO EL ALTO' },
          { value: 'ATOYAC' },
          { value: 'AUTLAN DE NAVARRO' },
          { value: 'AYOTLAN' },
          { value: 'AYUTLA' },
          { value: 'BOLAÑOS' },
          { value: 'CABO CORRIENTES' },
          { value: 'CAÑADAS DE OBREGON' },
          { value: 'CASIMIRO CASTILLO' },
          { value: 'CHAPALA' },
          { value: 'CHIMALTITAN' },
          { value: 'CHIQUILISTLAN' },
          { value: 'CIHUATLAN' },
          { value: 'COCULA' },
          { value: 'COLOTLAN' },
          { value: 'CONCEPCION DE BUENOS AIRES' },
          { value: 'CUAUTITLAN DE GARCIA BARRAGAN' },
          { value: 'CUAUTLA' },
          { value: 'CUQUIO' },
          { value: 'DEGOLLADO' },
          { value: 'EJUTLA' },
          { value: 'EL ARENAL' },
          { value: 'EL GRULLO' },
          { value: 'EL LIMON' },
          { value: 'EL SALTO' },
          { value: 'ENCARNACION DE DIAZ' },
          { value: 'ETZATLAN' },
          { value: 'GOMEZ FARIAS' },
          { value: 'GUACHINANGO' },
          { value: 'GUADALAJARA' },
          { value: 'HOSTOTIPAQUILLO' },
          { value: 'HUEJUCAR' },
          { value: 'HUEJUQUILLA EL ALTO' },
          { value: 'IXTLAHUACAN DE LOS MEMBRILLOS' },
          { value: 'IXTLAHUACAN DEL RIO' },
          { value: 'JALOSTOTITLAN' },
          { value: 'JAMAY' },
          { value: 'JESUS MARIA' },
          { value: 'JILOTLAN DE LOS DOLORES' },
          { value: 'JOCOTEPEC' },
          { value: 'JUANACATLAN' },
          { value: 'JUCHITLAN' },
          { value: 'LA BARCA' },
          { value: 'LA HUERTA' },
          { value: 'LA MANZANILLA DE LA PAZ' },
          { value: 'LAGOS DE MORENO' },
          { value: 'MAGDALENA' },
          { value: 'MASCOTA' },
          { value: 'MAZAMITLA' },
          { value: 'MEXTICACAN' },
          { value: 'MEZQUITIC' },
          { value: 'MIXTLAN' },
          { value: 'OCOTLAN' },
          { value: 'OJUELOS DE JALISCO' },
          { value: 'PIHUAMO' },
          { value: 'PONCITLAN' },
          { value: 'PUERTO VALLARTA' },
          { value: 'QUITUPAN' },
          { value: 'SAN CRISTOBAL DE LA BARRANCA' },
          { value: 'SAN DIEGO DE ALEJANDRIA' },
          { value: 'SAN GABRIEL' },
          { value: 'SAN IGNACIO CERRO GORDO' },
          { value: 'SAN JUAN DE LOS LAGOS' },
          { value: 'SAN JUANITO DE ESCOBEDO' },
          { value: 'SAN JULIAN' },
          { value: 'SAN MARCOS' },
          { value: 'SAN MARTIN DE BOLAÑOS' },
          { value: 'SAN MARTIN DE HIDALGO' },
          { value: 'SAN MIGUEL EL ALTO' },
          { value: 'SAN SEBASTIAN DEL OESTE' },
          { value: 'SANTA MARIA DE LOS ANGELES' },
          { value: 'SANTA MARIA DEL ORO' },
          { value: 'SAYULA' },
          { value: 'TALA' },
          { value: 'TALPA DE ALLENDE' },
          { value: 'TAMAZULA DE GORDIANO' },
          { value: 'TAPALPA' },
          { value: 'TECALITLAN' },
          { value: 'TECOLOTLAN' },
          { value: 'TECHALUTA DE MONTENEGRO' },
          { value: 'TENAMAXTLAN' },
          { value: 'TEOCALTICHE' },
          { value: 'TEOCUITATLAN DE CORONA' },
          { value: 'TEPATITLAN DE MORELOS' },
          { value: 'TEQUILA' },
          { value: 'TEUCHITLAN' },
          { value: 'TIZAPAN EL ALTO' },
          { value: 'TLAJOMULCO DE ZUÑIGA' },
          { value: 'TLAQUEPAQUE' },
          { value: 'TOLIMAN' },
          { value: 'TOMATLAN' },
          { value: 'TONALA' },
          { value: 'TONAYA' },
          { value: 'TONILA' },
          { value: 'TOTATICHE' },
          { value: 'TOTOTLAN' },
          { value: 'TUXCACUESCO' },
          { value: 'TUXCUECA' },
          { value: 'TUXPAN' },
          { value: 'UNION DE SAN ANTONIO' },
          { value: 'UNION DE TULA' },
          { value: 'VALLE DE GUADALUPE' },
          { value: 'VALLE DE JUAREZ' },
          { value: 'VILLA PURIFICACION' },
          { value: 'VILLA CORONA' },
          { value: 'VILLA GUERRERO' },
          { value: 'VILLA HIDALGO' },
          { value: 'YAHUALICA DE GONZALEZ GALLO' },
          { value: 'ZACOALCO DE TORRES' },
          { value: 'ZAPOPAN' },
          { value: 'ZAPOTILTIC' },
          { value: 'ZAPOTITLAN DE VADILLO' },
          { value: 'ZAPOTLAN DEL REY' },
          { value: 'ZAPOTLAN EL GRANDE' },
          { value: 'ZAPOTLANEJO' }
        ]
      };

      self.datosGrados = new ArrayDataProvider(self.grados, { keyAttributes: 'value' });

      var diccionario = {
        clave_sep: "Clave CCT",
        direccion: "Dirección",
        codigo_postal: "Código Postal",
        telefono: "Teléfono",
        anio_ingreso: "Año ingreso",
        anio_graduacion: "Año graduación"
      };

      self.validadorTelefonico = ko.computed(function () {
        return [{
          type: 'regExp',
          options: {
            pattern: '[0-9]{10}',
            messageSummary: 'Valor inválido',
            messageDetail: 'Deben ser 10 dígitos.'
          }
        }];
      });

      self.validadorPostal = ko.computed(function () {
        return [{
          type: 'regExp',
          options: {
            pattern: '[0-9]{5}',
            messageSummary: 'Valor inválido',
            messageDetail: 'Deben ser 5 dígitos.'
          }
        }];
      });

      self.validadorGeo = ko.computed(function () {
        return [{
          type: 'regExp',
          options: {
            pattern: '[A-Za-z, \\.0-9-]+',
            messageSummary: 'Valor inválido',
            messageDetail: 'Solo se permiten letras, números, punto, coma y espacio.'
          }
        }];
      });

      self.validadorNombre = ko.computed(function () {
        return [{
          type: 'regExp',
          options: {
            pattern: '[A-Za-z \\.0-9]+',
            messageSummary: 'Valor inválido',
            messageDetail: 'Solo se permiten letras, números, punto y espacio.'
          }
        }];
      });

      self.validadorCCT = ko.computed(function () {
        return [{
          type: 'regExp',
          options: {
            pattern: '[A-Z0-9]+',
            messageSummary: 'Valor inválido',
            messageDetail: 'Corrija el campo.'
          }
        }];
      });

      self.validadorLetra = ko.computed(function () {
        return [{
          type: 'regExp',
          options: {
            pattern: '[A-Z]{1}',
            messageSummary: 'Valor inválido',
            messageDetail: 'Corrija el campo.'
          }
        }];
      });

      self.convertidorFechas = ko.observable(oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).
        createConverter(
          {
            pattern: "dd/MM/yyyy"
          }));

      // Header Config
      self.headerConfig = ko.observable({ 'view': [], 'viewModel': null });
      moduleUtils.createView({ 'viewPath': 'views/header.html' }).then(function (view) {
        self.headerConfig({ 'view': view, 'viewModel': new app.getHeaderModel() })
      });
      
      function manejarErrores(error) {
        alert("Error durante la inicialización, intente reiniciando la aplicación, si la falla persiste contecte al soporte técnico");
        console.log("Error en la base de datos: " + error.message);
      }

      self.estadoSeleccionado = function (event) {
        var estado = event['detail'].value;
        if (estado !== "" && self.municipios.hasOwnProperty(estado) && Object.keys(self.municipios[estado]).length > 0) {
          self.datosMunicipios(new ArrayDataProvider(self.municipios[estado], { keyAttributes: 'value' }));
          self.campoMunicipio(self.municipios[estado][0].value);
        }
      };

      self.diferenciaAnios = function(fecha1, fecha2, redondearHaciaArriba) {
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

        return ((invertida ? -1 : 1) * (aniosDiferencia * 12 + mesesDiferencia + correcionMeses)) / 12;
      };

      self.obtenerGrupos = function (idEscuela) {
        return new Promise((resolve, reject) => {
          if (oj.gOfflineMode() === true) {            
            var gruposEscuelas = [];
            var consultaGrupos = "SELECT id_grupo, letra, anio_ingreso, anio_graduacion FROM grupos WHERE id_escuela = ?"
            oj.gConexionDB().transaction(function (transaccion) {
              transaccion.executeSql(consultaGrupos,
                [idEscuela], function (transaccion, resultados) {
                  var numFilas = resultados.rows.length;
                  if (numFilas > 0) {
                    for (var indiceFila = 0; indiceFila < numFilas; indiceFila++) {
                      var fila = resultados.rows.item(indiceFila);
                      var hoy = new Date();
                      var fechaIngreso = new Date('08/01/' + fila.anio_ingreso);
                      var diferencia = self.diferenciaAnios(fechaIngreso, hoy, false);
                      var grado = Math.ceil(diferencia);
                      var grupo = {
                        id_grupo: fila.id_grupo,
                        letra: fila.letra,
                        anio_ingreso: fila.anio_ingreso,
                        anio_graduacion: fila.anio_graduacion,
                        grado: grado > 6 ? "EGRESADO" : grado
                      };
                      gruposEscuelas.push(grupo);
                    }
                    resolve(gruposEscuelas);
                  }
                  resolve(gruposEscuelas);
                }, manejarErrores);
            }, function (error) {
              alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
              console.log("Error en la base de datos: " + error.message);
              resolve(gruposEscuelas);
            });
          } else {
            var peticionDatosGrupos = new XMLHttpRequest();
            peticionDatosGrupos.open('GET', oj.gWSUrl() + "obtenerDatosGrupos/" + idEscuela, false);
            peticionDatosGrupos.onreadystatechange = function () {
              if (this.readyState === 4) {
                if (this.status === 200) {
                  var json = JSON.parse(this.responseText);
                  if (!json.hasOwnProperty("error")) {
                    resolve(json.grupos);
                  } else {
                    resolve([]);
                  }
                } else {
                  resolve([]);
                }
              }
            };
            peticionDatosGrupos.send();
          }
        });
      };

      self.agregarEscuela = function() {
        var campoCCT = document.getElementById("campo-cct");
        var campoNombre = document.getElementById("campo-nombre");
        var campoDireccion = document.getElementById("campo-direccion");
        var campoColonia = document.getElementById("campo-colonia");
        var campoCPostal = document.getElementById("campo-codigo-postal");
        var campoTelefono = document.getElementById("campo-telefono");

        campoCCT.validate();
        campoNombre.validate();
        campoDireccion.validate();
        campoColonia.validate();
        campoCPostal.validate();
        campoTelefono.validate();
        if (campoCCT.valid === 'invalidShown' || campoNombre.valid === 'invalidShown' ||
          campoDireccion.valid === 'invalidShown' || campoColonia.valid === 'invalidShown' ||
          campoCPostal.valid === 'invalidShown' || campoTelefono.valid === 'invalidShown') {
          return;
        }

        var consultaEscuela = "INSERT INTO escuelas(clave_sep, nombre, direccion, colonia, codigo_postal, telefono, municipio, estado)\n"
                            + "VALUES(?,?,?,?,?,?,?,?)";

        var parametros = [
          self.campoCCT().toUpperCase(),
          self.campoNombre().toUpperCase(),
          self.campoDireccion().toUpperCase(),
          self.campoColonia().toUpperCase(),
          self.campoCodigoPostal(),
          self.campoTelefono(),
          self.campoMunicipio(),
          self.campoEstado()
        ];

        if(self.botonDialogoEscuela() === "Guardar") {
          consultaEscuela = "UPDATE escuelas SET\n"
                            + "clave_sep = ?,\n"
                            + "nombre = ?,\n"
                            + "direccion = ?,\n"
                            + "colonia = ?,\n"
                            + "codigo_postal = ?,\n"
                            + "telefono = ?,\n"
                            + "municipio = ?,\n"
                            + "estado = ?\n"
                            + "WHERE id_escuela = ?";

          parametros.push(escuelaActual.id_escuela);
        }

        oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql(consultaEscuela,
            parametros, function(transaccion, resultados) {
              if(self.botonDialogoEscuela() === "Agregar") {
                alert("Escuela agregada exitosamente.");
              } else {
                alert("Escuela actualizada exitosamente,");
                self.grupoSeleccionado(undefined);
              }              
              self.cerrarDialogoEscuela();
              self.cargarEscuelas();
            }, manejarErrores);
          }, function(error) {
            if(self.botonDialogoEscuela() === "Agregar") {
              alert("Error al agregar la escuela, revisa los datos.");
            } else {
              alert("Error al actualizar la escuela, revise los datos.");
            }
            console.log(error.message);
          });                            
      };

      self.agregarGrupo = function() {
        var fechaToma = new Date();
        var mesToma = fechaToma.getMonth() + 1;
        var anioToma = fechaToma.getFullYear();
        anioToma = mesToma >= 8 && mesToma <= 12 ? anioToma : anioToma - 1;
        var campoLetra = document.getElementById("campo-letra");        

        campoLetra.validate();

        if (campoLetra.valid === 'invalidShown') {
          return;
        }

        if(self.fechaToma() !== "" && self.fechaToma() !== undefined) {
          fechaToma = new Date(self.fechaToma());
          mesToma = fechaToma.getMonth() + 1;
          anioToma = fechaToma.getFullYear();
          anioToma = mesToma >= 8 && mesToma <= 12 ? anioToma : anioToma - 1;
        }

        var anioIngreso = (anioToma - self.campoGrado() + 1);
        var consultaGrupo = "INSERT INTO grupos(letra, anio_ingreso, id_escuela) VALUES(?,?,?)";

        var parametros = [
          self.campoLetra(),
          anioIngreso,
          escuelaActual.id_escuela
        ];

        if(self.botonDialogoGrupo() === "Guardar") {
          consultaGrupo = "UPDATE grupos SET\n"
                          + "letra = ?,\n"
                          + "anio_ingreso = ?\n"
                          + "WHERE id_grupo = ?"

          parametros = [
            self.campoLetra(),
            anioIngreso,
            self.grupoSeleccionado()
          ];                                                    
        }
        
        oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql(consultaGrupo,
            parametros, function(transaccion, resultados) {
              if(self.botonDialogoGrupo() === "Agregar") {                
                self.tituloNotificacionGrupo("Grupo creado");
              } else {                
                self.tituloNotificacionGrupo("Grupo actualizado");
              }    

              var hoy = new Date();
              var fechaIngreso = new Date('08/01/' + anioIngreso);
              var diferencia = self.diferenciaAnios(fechaIngreso, hoy, false);
              var grado = Math.ceil(diferencia);        
              
              if(grado > 6) {
                self.grupoFinal("EGRESADO");
                self.mensajeGrupo("No podrá usar este grupo, ya que esta egresado, por favor edítelo:");
              } else {
                self.grupoFinal(grado + " " + self.campoLetra());
                self.mensajeGrupo("Debes seleccionar:");
              }
              
              self.ocultarCancelar(true);
              document.getElementById("dialogo-notif-grupo").open();
              self.cerrarDialogoGrupo();
              self.cargarEscuelas();
            }, manejarErrores);
          }, function(error) {
            if(self.botonDialogoEscuela() === "Agregar") {
              alert("Error al agregar el grupo, revisa los datos.");
            } else {
              alert("Error al actualizar el grupo, revise los datos.");
            }
            console.log(error.message);
          });
      };

      self.eliminarGrupo = function() {
        if(self.grupoSeleccionado() === undefined) {
          alert("Favor de seleccionar un grupo.");
          return;
        }

        self.tituloNotificacionGrupo("Eliminar grupo");
        self.mensajeGrupo("Al eliminar un grupo se eliminaran a los alumnos y mediciones dependientes, esta operación puede corromper la base de datos, ¿desea continuar?");
        self.grupoFinal("");
        self.ocultarCancelar(false);
        var idGrupo = document.getElementById(escuelaActual.id_escuela.toString())
                              .getElementsByTagName("oj-list-view")[1]
                              .getElementsByClassName("oj-selected")[0].id.replace("grupo", "");
        self.grupoSeleccionado(idGrupo);
        document.getElementById("dialogo-notif-grupo").open();
      };

      self.eliminarEscuela = function() {
        if(Object.keys(escuelaActual).length === 0) {
          alert("Favor de seleccionar una escuela.");
          return;
        }

        self.tituloNotificacionGrupo("Eliminar escuela");
        self.mensajeGrupo("Al eliminar una escuela se eliminaran a los grupos, alumnos y mediciones dependientes, esta operación puede corromper la base de datos, ¿desea continuar?");
        self.grupoFinal("");
        self.ocultarCancelar(false);
        document.getElementById("dialogo-notif-grupo").open();
      };

      self.cancelarEliminar = function() {
        document.getElementById("dialogo-notif-grupo").close();
      };

      function eliminarEscuela(transaccion, resultados) {
        var consultaEliminarGrupo = "DELETE FROM escuelas WHERE id_escuela = ?";
        oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql(consultaEliminarGrupo,
            [escuelaActual.id_escuela], function(transaccion, resultados) {              
              self.cargarEscuelas();             
              alert("La escuela ha sido eliminada satisfactoriamente.");    
              self.grupoSeleccionado(undefined);          
            }, manejarErrores);
        }, function (error) {
          alert("Error al eliminar la escuela, consulte al soporte técnico.");
          console.log(error.message);
        });
      }

      function eliminarGrupo(idGrupo) {
        var consultaEliminarGrupo = "DELETE FROM grupos WHERE id_grupo = ?";
        oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql(consultaEliminarGrupo,
            [idGrupo], function(transaccion, resultados) {     
              if(self.tituloNotificacionGrupo() === "Eliminar grupo") {                
                alert("El grupo ha sido eliminado satisfactoriamente."); 
                self.cargarEscuelas();   
              }
              self.grupoSeleccionado(undefined);          
            }, manejarErrores);
        }, function (error) {
          alert("Error al eliminar el grupo, consulte al soporte técnico.");
          console.log(error.message);
        });
      }

      function eliminarAlumnos(transaccion, resultados, grupoActual) {
        var consultaEliminarAlumnos = "DELETE FROM alumnos WHERE id_alumno = ?";
        var consultaEliminarMediciones = "DELETE FROM datos WHERE id_alumno = ?";
        var numFilas = resultados.rows.length;
        var contadorAsincrono = 0;

        if(numFilas === 0) {
          eliminarGrupo(grupoActual);
        }

        for (var indiceFila = 0; indiceFila < numFilas; indiceFila++) {
          var fila = resultados.rows.item(indiceFila);
          oj.gConexionDB().transaction(function (transaccionA) {
            transaccionA.executeSql(consultaEliminarMediciones,
              [fila.id_alumno], function (transaccionB, resultados) {
                oj.gConexionDB().transaction(function (transaccionC) {
                  transaccionC.executeSql(consultaEliminarAlumnos,
                    [fila.id_alumno], function(transaccionD, resultados) {
                      if(contadorAsincrono === numFilas-1) {
                        eliminarGrupo(grupoActual);
                      } else {
                        contadorAsincrono++;
                      }
                    }, manejarErrores);
                }, function (error) {
                  alert("Error al eliminar el grupo, consulte al soporte técnico.");
                  console.log(error.message);
                });
              }, manejarErrores);
          }, function (error) {
            alert("Error al eliminar el grupo, consulte al soporte técnico.");
            console.log(error.message);
          });
        }
      }

      self.eliminarTodoElGrupo = function (idGrupo) {
        var consultaEliminarAlumnos = "SELECT id_alumno FROM alumnos WHERE id_grupo = ?";
        oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql(consultaEliminarAlumnos,
            [idGrupo], function(transaccion, resultados) {
              eliminarAlumnos(transaccion, resultados, idGrupo);
            }, manejarErrores);
        }, function (error) {
          alert("Error al eliminar el grupo, consulte al soporte técnico.");
          console.log(error.message);
        });
      };

      self.eliminarTodaLaEscuela = function() {
        var consultaEliminarAlumnos = "SELECT id_grupo FROM grupos WHERE id_escuela = ?";
        oj.gConexionDB().transaction(function (transaccion) {
          transaccion.executeSql(consultaEliminarAlumnos,
            [escuelaActual.id_escuela], function(transaccion, resultados) {
              var numFilas = resultados.rows.length;
              if (numFilas === 0) {
                eliminarEscuela();
              }

              for (var indiceFila = 0; indiceFila < numFilas; indiceFila++) {
                self.grupoSeleccionado(resultados.rows.item(indiceFila).id_grupo);
                self.eliminarTodoElGrupo(resultados.rows.item(indiceFila).id_grupo);
                if(indiceFila === numFilas-1) {
                  eliminarEscuela();
                }
              }
            }, manejarErrores);
        }, function (error) {
          alert("Error al eliminar la escuela, consulte al soporte técnico.");
          console.log(error.message);
        });
      };

      self.aceptarGrupo = function() {
        if(self.tituloNotificacionGrupo() === "Eliminar grupo") {
          self.eliminarTodoElGrupo(self.grupoSeleccionado());       
        } else if(self.tituloNotificacionGrupo() === "Eliminar escuela") {
          self.eliminarTodaLaEscuela();
        }       
        
        document.getElementById("dialogo-notif-grupo").close();
      };

      self.crearNuevaEscuela = function() {
        self.tituloDialogoEscuela("Agregar nueva escuela");
        self.botonDialogoEscuela("Agregar");
        document.getElementById("dialogo-nueva-escuela").open();
      };

      self.editarEscuela = function() {
        if(Object.keys(escuelaActual).length === 0) {
          alert("Favor de seleccionar una escuela.");
          return;
        }

        self.tituloDialogoEscuela("Editar escuela");
        self.botonDialogoEscuela("Guardar");
        self.campoCCT(escuelaActual.clave_sep);
        self.campoNombre(escuelaActual.nombre);
        self.campoDireccion(escuelaActual.direccion);
        self.campoColonia(escuelaActual.colonia);
        self.campoCodigoPostal(escuelaActual.codigo_postal);
        self.campoTelefono(escuelaActual.telefono);
        self.campoMunicipio(escuelaActual.municipio);
        self.campoEstado(escuelaActual.estado);
        document.getElementById("dialogo-nueva-escuela").open();
      };

      self.cerrarDialogoEscuela = function() {
        self.campoCCT("");
        self.campoNombre("");
        self.campoDireccion("");
        self.campoColonia("");
        self.campoCodigoPostal("");
        self.campoTelefono("");
        self.campoMunicipio(self.municipios[self.campoEstado()][0].value);
        document.getElementById("dialogo-nueva-escuela").close();
      };

      self.crearNuevoGrupo = function() {
        self.botonDialogoGrupo("Agregar");
        self.tituloDialogoGrupo("Agregar nuevo grupo");
        document.getElementById("dialogo-nuevo-grupo").open();
      };

      self.editarGrupo = function() {
        var grupoSeleccionado = document.getElementById(escuelaActual.id_escuela.toString())
                                        .getElementsByTagName("oj-list-view")[1]
                                        .getElementsByClassName("oj-selected")[0];

        if(grupoSeleccionado === undefined) {
          alert("Favor de seleccionar un grupo");
          return;
        }                                

        self.botonDialogoGrupo("Guardar");
        self.tituloDialogoGrupo("Editar grupo");
        var idGrupo = grupoSeleccionado.id.replace("grupo", "");
        self.grupoSeleccionado(idGrupo);
        
        todosLosGrupos[escuelaActual.id_escuela].some(function(grupo) {
          if(parseInt(idGrupo) === grupo.id_grupo) {
            self.campoGrado(grupo.grado <= 6 ? grupo.grado : 6);
            self.campoLetra(grupo.letra);
            return true;
          }
        });                                  
        document.getElementById("dialogo-nuevo-grupo").open();
      };

      self.cerrarDialogoGrupo= function() {
        self.campoGrado(1);
        self.campoLetra("");
        self.fechaToma("");
        document.getElementById("dialogo-nuevo-grupo").close();
      };

      self.abrirEscuela = function(event) {
        todasLasEscuelas.some(function(escuela) {
          if(event.target.id === escuela.id_escuela.toString()) {  
            escuelaActual = escuela;          
            return true;
          }
        });
      };

      self.cerrarEscuela = function(event) {
        escuelaActual = {};
      }

      self.procesarDatosEscolares = function (json) {
        document.getElementById("lista-escuelas").remove();
        var contenedor = document.getElementById("contenedor-escuelas");
        var accordion = document.createElement('oj-accordion');
        accordion.setAttribute("id", "lista-escuelas");
        todasLasEscuelas = json.escuelas;
        Object.entries(json.escuelas).forEach(([indiceEscuela, escuela]) => {
          var colapsableEscuela = document.createElement('oj-collapsible');
          colapsableEscuela.addEventListener('ojExpand', self.abrirEscuela);
          colapsableEscuela.addEventListener('ojCollapse', self.cerrarEscuela);
          var nombreEscuela = document.createElement('h3');
          nombreEscuela.setAttribute('slot', 'header');
          nombreEscuela.innerText = escuela.nombre;

          var listaVista = document.createElement('oj-list-view');
          var lista = document.createElement('ul');

          var barraHGrupos = document.createElement('oj-toolbar');
          barraHGrupos.style.width = "100%";
          barraHGrupos.classList.add("oj-toolbar-bottom-border");
          barraHGrupos.classList.add("oj-sm-justify-content-space-around");

          var botonAgregarGrupo = document.createElement("oj-button");
          botonAgregarGrupo.setAttribute("display", "icons");
          botonAgregarGrupo.setAttribute("on-oj-action", "[[crearNuevoGrupo]]");
          var iconoBotonAGrupo = document.createElement("span");
          iconoBotonAGrupo.setAttribute("slot", "startIcon");
          iconoBotonAGrupo.classList.add("oj-ux-ico-file-add");
          botonAgregarGrupo.appendChild(iconoBotonAGrupo);

          var botonEditarGrupo = document.createElement("oj-button");
          botonEditarGrupo.setAttribute("display", "icons");
          botonEditarGrupo.setAttribute("on-oj-action", "[[editarGrupo]]");
          var iconoBotonEGrupo = document.createElement("span");
          iconoBotonEGrupo.setAttribute("slot", "startIcon");
          iconoBotonEGrupo.classList.add("oj-ux-ico-add-edit-page");
          botonEditarGrupo.appendChild(iconoBotonEGrupo);

          barraHGrupos.appendChild(botonAgregarGrupo);
          barraHGrupos.appendChild(botonEditarGrupo);

          var botonEliminarGrupo = document.createElement("oj-button");
          botonEliminarGrupo.setAttribute("display", "icons");
          botonEliminarGrupo.setAttribute("on-oj-action", "[[eliminarGrupo]]");
          var iconoBotonRGrupo = document.createElement("span");
          iconoBotonRGrupo.setAttribute("slot", "startIcon");
          iconoBotonRGrupo.classList.add("oj-ux-ico-file-remove");
          botonEliminarGrupo.appendChild(iconoBotonRGrupo);
          barraHGrupos.appendChild(botonEliminarGrupo);

          var listaVistaGrupos = document.createElement('oj-list-view');
          listaVistaGrupos.setAttribute("selection-mode", "single");
          listaVistaGrupos.setAttribute("translations.msg-no-data", "Sin grupos");
          var listaGrupos = document.createElement('ul');

          Object.entries(escuela).forEach(([nCampo, nValor]) => {
            if (nCampo === "id_escuela") {
              colapsableEscuela.setAttribute("id", nValor);
              self.obtenerGrupos(nValor).then(function (arregloGrupos) {
                todosLosGrupos[nValor] = arregloGrupos;
                Object.entries(arregloGrupos).forEach(([nCampo, nValor]) => {
                  if (nCampo === "id_grupo") {
                    return;
                  }

                  var linea = document.createElement('li');
                  linea.setAttribute("id", "grupo" + nValor.id_grupo);
                  var contenido = document.createElement('oj-list-item-layout');
                  var valor = document.createElement('span');
                  valor.innerText = "Grupo: " + nValor.grado + " " + nValor.letra;

                  var campo = document.createElement('span');
                  campo.innerText = "Generación: " + nValor.anio_ingreso + " - " + nValor.anio_graduacion;
                  campo.classList.add("oj-text-color-secondary");
                  campo.setAttribute('slot', 'secondary');

                  contenido.appendChild(valor);
                  contenido.appendChild(campo);
                  linea.appendChild(contenido);
                  listaGrupos.appendChild(linea);
                }); 

                // Hasta que se aplican los bindings debido a que las llamadas de BD son
                // asincronas, solo se aplican hasta que el último elemento de la lista
                // fue procesado.
                if(parseInt(indiceEscuela) === (todasLasEscuelas.length-1)){
                  ko.applyBindings(self, accordion);
                }
              });
              return;
            }

            var linea = document.createElement('li');
            var contenido = document.createElement('oj-list-item-layout');
            var valor = document.createElement('span');
            valor.innerText = nValor;

            var campo = document.createElement('span');

            if (diccionario.hasOwnProperty(nCampo)) {
              campo.innerText = diccionario[nCampo];
            } else {
              campo.innerText = nCampo[0].toUpperCase() + nCampo.slice(1).replace("_", " ")
            }

            campo.classList.add("oj-text-color-secondary");
            campo.setAttribute('slot', 'secondary');

            contenido.appendChild(valor);
            contenido.appendChild(campo);
            linea.appendChild(contenido);
            lista.appendChild(linea);
          });

          var menuGrupos = document.createElement('oj-collapsible');
          menuGrupos.style = "padding-left: .90rem;";
          var tituloGrupos = document.createElement("span");
          tituloGrupos.setAttribute('slot', 'header');
          tituloGrupos.innerText = "Grupos"
          listaVista.appendChild(lista);
          listaVistaGrupos.appendChild(listaGrupos);
          menuGrupos.appendChild(tituloGrupos);
          menuGrupos.appendChild(barraHGrupos);
          menuGrupos.appendChild(listaVistaGrupos);
          
          colapsableEscuela.appendChild(nombreEscuela);
          colapsableEscuela.appendChild(listaVista);
          colapsableEscuela.appendChild(menuGrupos);
          accordion.appendChild(colapsableEscuela);
        });
        contenedor.appendChild(accordion);
      };

      self.cargarEscuelas = function () {
        if(oj.gOfflineMode() === true) {   
          var jsonEscuelas = {
            escuelas: []
          };      
          var consultaEscuelas = "SELECT id_escuela, clave_sep, nombre, direccion, colonia, codigo_postal, telefono, municipio, estado FROM escuelas"
          oj.gConexionDB().transaction(function (transaccion) {
            transaccion.executeSql(consultaEscuelas,
              [], function(transaccion, resultados) {
                var numFilas = resultados.rows.length;
                if(numFilas > 0) {
                  for (var indiceFila = 0; indiceFila < numFilas; indiceFila++) {
                    var fila = resultados.rows.item(indiceFila);
                    var escuela = {
                      id_escuela: fila.id_escuela,
                      clave_sep: fila.clave_sep,
                      nombre: fila.nombre,
                      direccion: fila.direccion,
                      colonia: fila.colonia,
                      codigo_postal: fila.codigo_postal,
                      telefono: fila.telefono,
                      municipio: fila.municipio,
                      estado: fila.estado
                    };
                    jsonEscuelas.escuelas.push(escuela);
                  }
                  self.procesarDatosEscolares(jsonEscuelas);
                }                                
              }, manejarErrores);
          }, function (error) {
            alert("Error durante la descarga de datos escolares, intente nuevamente o reinicie la aplicación.");
            console.log("Error en la base de datos: " + error.message);
          });
        } else {
          var peticionEscuelas = new XMLHttpRequest();
          peticionEscuelas.open("GET", oj.gWSUrl() + "obtenerDatosEscuelas", false);
          peticionEscuelas.onreadystatechange = function () {
            if (this.readyState === 4) {
              if (this.status === 200) {
                var json = JSON.parse(this.responseText);
                self.procesarDatosEscolares(json);
              }
            }
          };
          peticionEscuelas.send();
        }      
      };

      $(document).ready(function () {
        self.cargarEscuelas();
      });

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
        accUtils.announce('Datos escolares cargados.');
        document.title = "Datos escolares";
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

      self.addMenu = function () {
        document.getElementById('lista-escuelas').remove();
        var container = document.getElementById("contenedor-escuelas");
        var accordion = document.createElement('oj-accordion');
        accordion.setAttribute("id", "lista-escuelas");
        var collapsible = document.createElement('oj-collapsible');
        var header = document.createElement('h3');
        header.setAttribute('slot', 'header');
        header.innerText = 'Header 3';

        var listView = document.createElement('oj-list-view');
        var list = document.createElement('ul');

        var first = document.createElement('li');
        var fContent = document.createElement('oj-list-item-layout');
        var valor = document.createElement('span');
        valor.innerText = "76";

        var campo = document.createElement('span');
        campo.innerText = "Meses";
        campo.classList.add("oj-text-color-secondary");
        campo.setAttribute('slot', 'secondary');

        fContent.appendChild(valor);
        fContent.appendChild(campo);
        first.appendChild(fContent);

        var second = document.createElement('li');
        var sContent = document.createElement('oj-list-item-layout');
        var valor2 = document.createElement('span');
        valor2.innerText = "25.3";

        var campo2 = document.createElement('span');
        campo2.innerText = "Peso";
        campo2.classList.add("oj-text-color-secondary");
        campo2.setAttribute('slot', 'secondary');

        sContent.appendChild(valor2);
        sContent.appendChild(campo2);
        second.appendChild(sContent);

        list.appendChild(first);
        list.appendChild(second);
        listView.appendChild(list);
        collapsible.appendChild(header);
        collapsible.appendChild(listView);


        var collapsible2 = document.createElement('oj-collapsible');
        var header2 = document.createElement('h3');
        header2.setAttribute('slot', 'header');
        header2.innerText = 'Header 4';
        var paragraph2 = document.createElement('p');
        paragraph2.innerText = 'Content 4.';
        collapsible2.appendChild(header2);
        collapsible2.appendChild(paragraph2);

        accordion.appendChild(collapsible);
        accordion.appendChild(collapsible2);
        container.appendChild(accordion);
        ko.applyBindings(self, accordion);
      };
    }

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return ModeloDatosEscolares;
  }
);
