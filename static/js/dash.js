const PREFIX = "https://park-accidents-api.herokuapp.com/"
var city_url = `${PREFIX}/api/v1.0/accident_location_city`
var api_url = `${PREFIX}/api/v1.0/all_accidents`
var bus_types = []
var markerLayer = null
// Perform a GET request to the query URLs
d3.json(api_url).then(function(data) {
    data.accidents.forEach(accident => bus_types.push(accident.bus_type));
    console.log(d3.map(bus_types, function(d){return d;}).keys());
    // populate the select feilds with each unique business types
    d3.select("#selDataset").selectAll("option")
    .data(d3.map(bus_types, function(d){return d}).keys())
    .enter()
    .append("option")
    .text(function(d){return d})
    .attr("value",function(d){return d});

    d3.json(city_url).then(function(response){
        init(response.features);
    })

});

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

// Create our map
var myMap = L.map("mapid", {
    center: [
        37.09, -95.71
    ],
    zoom: 4,
    layers: [darkmap]
});

 var layers = L.control.layers(baseMaps).addTo(myMap);


function getBusTypesLayer(geodata){
// var layerData;
    var bus_type = d3.select("#selDataset").property("value");
    var filteredData = L.geoJSON(geodata, {
        pointToLayer: function (feature, lnglat){
            return L.circleMarker(lnglat, {
                radius: 5,
                fillColor: "red",
                color: "#000",
                weight: 1,
                opacity: 1, 
                fillOpactiy: 1
            });

        },
        filter: function(feature, layer){
            return feature.properties.bus_type == bus_type;
        }
    })  

    return filteredData;
}


function updateMap(geodata){
    if(markerLayer){myMap.removeLayer(markerLayer);}
    markerLayer = getBusTypesLayer(geodata);
    myMap.addLayer(markerLayer);
}


function init(geodata){
    updateMap(geodata);
}

function optionChanged(){
    d3.json(city_url).then(function(response){
        init(response.features);
    })
}