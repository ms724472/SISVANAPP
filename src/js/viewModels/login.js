/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/*
 * Your about ViewModel code goes here
 */
define(['knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils', 'ojs/ojarraydataprovider',
    'ojs/ojinputtext', 'ojs/ojprogress-circle'],
    function (ko, app, moduleUtils, accUtils, ArrayDataProvider) {

        function ModeloInicioSesion() {
            var self = this;
            self.usuario = ko.observable("");
            self.contrasenia = ko.observable("");

            // Header Config
            self.headerConfig = ko.observable({ 'view': [], 'viewModel': null });
            moduleUtils.createView({ 'viewPath': 'views/header.html' }).then(function (view) {
                self.headerConfig({ 'view': view, 'viewModel': new app.getHeaderModel() })
            })

            self.redireccionar = function () {
                app.router = oj.Router.rootInstance;

                navData = [
                    {
                        name: 'Colectivas', id: 'evalGrup',
                        iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24'
                    },
                    {
                        name: 'Individuales', id: 'evalIndv',
                        iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-person-icon-24'
                    },
                    {
                        name: 'Estadísticas', id: 'estUtils',
                        iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'
                    }
                ];

                if (oj.gModoDependiente() !== true) {
                    app.router.configure({
                        'evalGrup': { label: 'Evaluaciones colectivas', isDefault: true },
                        'evalIndv': { label: 'Evaluación individual' },
                        'estUtils': { label: 'Estadísticas OMS' },
                        'datEsc': { label: 'Datos escolares' }
                    });
                    navData.push({
                        name: 'Escolares', id: 'datEsc',
                        iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-library-icon-24'
                    });
                } else {
                    app.router.configure({
                        'evalGrup': { label: 'Evaluaciones colectivas', isDefault: true },
                        'evalIndv': { label: 'Evaluación individual' },
                        'estUtils': { label: 'Estadísticas OMS' }
                    });
                }

                app.navDataProvider(new ArrayDataProvider(navData, { keyAttributes: 'id' }));
                oj.Router.sync();
            }

            self.validarCredenciales = function () {                        
                var usuarioValido = false;
                var contraseniaValida = false;
                if(self.usuario() === "" || self.usuario() === undefined || self.contrasenia() === "" || self.contrasenia() === undefined) {
                    alert("Favor de introducir el usuario y la contraseña");
                    return;
                }

                oj.gConexionDB().transaction(function (transaccion) {
                    transaccion.executeSql("SELECT * from parametros",
                      [], function(transaccion, resultados) {
                        var numFilas = resultados.rows.length;
                        for (var indiceFila = 0; indiceFila < numFilas; indiceFila++) {
                            switch (resultados.rows.item(indiceFila).nombre) {
                                case "usuario":
                                    usuarioValido = (resultados.rows.item(indiceFila).valor === self.usuario());
                                    break;
                                case "contrasenia":
                                    contraseniaValida = (resultados.rows.item(indiceFila).valor === self.contrasenia());
                                    break;
                            }
                        }

                        if(usuarioValido && contraseniaValida) {
                            document.getElementById("formulario-sesion").style.display = "none";
                            document.getElementById("cargando-sesion").style.display = "block";
                            self.redireccionar();
                        } else {
                            alert("El usuario o la contrasña son incorrectas, por favor revíselas.")
                        }
                      }, function(error) {
                        alert("Error de autenticación.");
                        console.log(error.message);                        
                      });
                  }, function (error) {
                    alert("Error de autenticación.");
                    console.log("Error en la base de datos: " + error.message);
                  });                
            };

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
                accUtils.announce('Inicio de Sesion Cargado.');
                document.title = "Inicio Sesión";
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
        return ModeloInicioSesion;
    }
);
