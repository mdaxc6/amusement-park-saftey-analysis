const PREFIX = "https://park-accidents-api.herokuapp.com/"

function init() {
    var states_url = `${PREFIX}/api/v1.0/accident_location_state`
    var city_url = `${PREFIX}/api/v1.0/accident_location_city`
    // Perform a GET request to the query URLs
    d3.json(states_url).then(function (stateData) {
        console.log(stateData);
        d3.json(city_url).then(function(cityData){
            console.log(cityData);
            createFeatures(stateData.features, cityData.features);
        });
    });

    console.log("init");

}

function createFeatures(stateData, cityData){

    function onEachFeature(feature, layer) {
        layer.bindPopup(`
            <h3><strong>${feature.properties.date}</strong></h3>
            <hr>
            <h4>${feature.properties.city}, ${feature.properties.state}</h5>
            <p>Device Type: ${feature.properties.device_type}<br>
            Number Injured: ${feature.properties.num_injured}<br>
            Injury Description: ${feature.properties.injury_desc}<br>
            ${feature.properties.acc_desc}</p>`);

    };

    raidusScale = d3.scaleLinear()
        .domain([1,99])
        .range([5, 30])

    var accidents_state = L.geoJSON(stateData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, lnglat){
            return L.circleMarker(lnglat, {
                radius: raidusScale(feature.properties.num_injured),
                fillColor: "red",
                color: "#000",
                weight: 1,
                opacity: 1, 
                fillOpactiy: 0.8
            });
        }
    });

    var accidents_city = L.geoJSON(cityData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, lnglat){
            try{
                return L.circleMarker(lnglat, {
                    radius: raidusScale(feature.properties.num_injured), 
                    fillColor: "red",
                    color: "#000",
                    weight: 1,
                    opacity: 1, 
                    fillOpactiy: 0.8
                });
            } catch (error){
                console.log("no city data")
            }
        }
    });
    console.log("geoJSON obect:", accidents_state)
    createMap(accidents_state, accidents_city);
}

function createMap(accidents_state, accidents_city) {
    // Define streetmap, darkmap and satellite layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "light-v10",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 18,
        id: "satellite-streets-v11",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Light Map": streetmap,
        "Dark Map": darkmap,
        "Satellite Map": satellitemap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Accidents_state: accidents_state,
        Accidents_city: accidents_city
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("mapid", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, accidents_city]
    });
    console.log("map created");
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    console.log("map added")
};

window.addEventListener('DOMContentLoaded', init);