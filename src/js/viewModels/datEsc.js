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
  'ojs/ojselectcombobox', 'ojs/ojdatetimepicker'],
  function (ko, $, app, moduleUtils, accUtils, ArrayDataProvider) {

    function ModeloDatosEscolares() {
      var self = this;
      self.datosMunicipios = ko.observableArray();
      
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

      // Header Config
      self.headerConfig = ko.observable({ 'view': [], 'viewModel': null });
      moduleUtils.createView({ 'viewPath': 'views/header.html' }).then(function (view) {
        self.headerConfig({ 'view': view, 'viewModel': new app.getHeaderModel() })
      });

      self.estadoSeleccionado = function (event) {
        var estado = event['detail'].value;
        if (estado !== "" && self.municipios.hasOwnProperty(estado) && Object.keys(self.municipios[estado]).length > 0) {
          self.datosMunicipios(new ArrayDataProvider(self.municipios[estado], { keyAttributes: 'value' }));
        }
      };

      self.obtenerGrupos = function (idEscuela) {
        var respuesta;
        var peticionDatosGrupos = new XMLHttpRequest();
        peticionDatosGrupos.open('GET', oj.gWSUrl() + "obtenerDatosGrupos/" + idEscuela, false);
        peticionDatosGrupos.onreadystatechange = function () {
          if (this.readyState === 4) {
            if (this.status === 200) {
              var json = JSON.parse(this.responseText);
              if (json.hasOwnProperty("error")) {
                respuesta = [];
              } else {
                respuesta = json.grupos;
              }
            }
          }
        };
        peticionDatosGrupos.send();
        return respuesta;
      };

      self.crearNuevaEscuela = function() {
        document.getElementById("dialogo-nueva-escuela").open();
      };

      self.cerrarDialogoEscuela= function() {
        document.getElementById("dialogo-nueva-escuela").close();
      };

      self.crearNuevoGrupo = function() {
        document.getElementById("dialogo-nuevo-grupo").open();
      };

      self.cerrarDialogoGrupo= function() {
        document.getElementById("dialogo-nuevo-grupo").close();
      };

      self.procesarDatosEscolares = function (json) {
        document.getElementById("lista-escuelas").remove();
        var contenedor = document.getElementById("contenedor-escuelas");
        var accordion = document.createElement('oj-accordion');
        accordion.setAttribute("id", "lista-escuelas");
        Object.entries(json.escuelas).forEach(([indiceEscuela, escuela]) => {
          var colapsableEscuela = document.createElement('oj-collapsible');
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
          iconoBotonAGrupo.classList.add("oj-ux-ico-add-create-page");
          botonAgregarGrupo.appendChild(iconoBotonAGrupo);

          var botonEditarGrupo = document.createElement("oj-button");
          botonEditarGrupo.setAttribute("display", "icons");
          var iconoBotonEGrupo = document.createElement("span");
          iconoBotonEGrupo.setAttribute("slot", "startIcon");
          iconoBotonEGrupo.classList.add("oj-ux-ico-add-edit-page");
          botonEditarGrupo.appendChild(iconoBotonEGrupo);

          barraHGrupos.appendChild(botonAgregarGrupo);
          barraHGrupos.appendChild(botonEditarGrupo);

          var listaVistaGrupos = document.createElement('oj-list-view');
          listaVistaGrupos.setAttribute("selection-mode", "single");
          listaVistaGrupos.setAttribute("translations.msg-no-data", "Sin grupos");
          var listaGrupos = document.createElement('ul');

          Object.entries(escuela).forEach(([nCampo, nValor]) => {
            if (nCampo === "id_escuela") {
              var arregloGrupos = self.obtenerGrupos(nValor);
              Object.entries(arregloGrupos).forEach(([nCampo, nValor]) => {
                if (nCampo === "id_grupo") {
                  return;
                }

                var linea = document.createElement('li');
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
        ko.applyBindings(self, accordion);
      };

      self.cargarEscuelas = function () {
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
