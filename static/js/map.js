document.addEventListener("DOMContentLoaded", function () {
    var map = L.map('map').setView([6.244203, -75.5812119], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    var controlCapas = L.control.layers({}, {}, { collapsed: false }).addTo(map);

    // Estilo para las comunas
    var estiloComunas = {
        fillColor: "#a6c4e0", // Color azul
        color: "#000",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7
    };

    // Función para mostrar información de la comuna al pasar el cursor por encima
    function mostrarInfoComuna(e) {
        var layer = e.target;
        var comunaNombre = layer.feature.properties.NOMBRE; //'NOMBRE'
        layer.bindPopup("Comuna: " + comunaNombre).openPopup();
    }

    // Cargar y visualizar las comunas como polígonos separados
    fetch('/comunas') // Solicitud HTTP GET a la ruta comunas (Asincrona)
        .then(response => response.json())
        .then(data => {
            var capasComunas = L.geoJSON(data, {
                onEachFeature: function (feature, layer) {
                    layer.on({
                        mouseover: mostrarInfoComuna,
                        mouseout: function (e) {
                            map.closePopup();
                        }
                    });
                },
                style: estiloComunas
            }).addTo(map);
            controlCapas.addOverlay(capasComunas, 'Comunas');
        })
        .catch(error => console.error('Error al cargar comunas:', error));

    // Cargar y visualizar los mejoramientos como puntos
    fetch('/mejoramientos')
        .then(response => response.json())
        .then(data => {
            var capaMejoramientos = L.geoJSON(data, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, {
                        radius: 4,
                        fillColor: "#ff7800",
                        color: "#000",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8
                    });
                }
            }).addTo(map);
            controlCapas.addOverlay(capaMejoramientos, 'Mejoramientos');
        })
        .catch(error => console.error('Error al cargar mejoramientos:', error));

    for (var i = 0; i < 100; i++) {
        // Crea un polígono de prueba con coordenadas ligeramente diferentes
        var polygonCoords = [
            [6.244203 + i * 0.001, -75.5812119],
            [6.244203, -75.5812119 + i * 0.001],
            [6.244203 + i * 0.001, -75.5812119 + i * 0.001]
        ];

        // Crea una capa de polígono y agrégala al mapa
        var pruebaPolygon = L.polygon(polygonCoords, {
            color: 'green',
            fillOpacity: 0.5
        }).addTo(map);

        // Agrégala al control de capas con un nombre único
        controlCapas.addOverlay(pruebaPolygon, 'Polígono ' + (i + 1));
    }

});
