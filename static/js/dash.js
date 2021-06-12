const PREFIX = "https://park-accidents-api.herokuapp.com/"
var city_url = `${PREFIX}/api/v1.0/accident_location_city`
var api_url = `${PREFIX}/api/v1.0/all_accidents`
var bus_types = []
var markerLayer = null
// Perform a GET request to the query URLs
d3.json(api_url).then(function (data) {
    console.log(data)
    data.accidents.forEach(accident => bus_types.push(accident.bus_type));
    // populate the select feilds with each unique business types
    d3.select("#selDataset").selectAll("option")
        .data(d3.map(bus_types, function (d) {
            return d
        }).keys())
        .enter()
        .append("option")
        .text(function (d) {
            return d
        })
        .attr("value", function (d) {
            return d
        });

    plotInit(data);

    d3.json(city_url).then(function (response) {
        mapInit(response.features);
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
        39.8283, -98.5795
    ],
    zoom: 4,
    layers: [streetmap]
});

var layers = L.control.layers(baseMaps).addTo(myMap);

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

var raidusScale = d3.scaleLinear()
.domain([1,99])
.range([5, 25])

function chooseColor(bus_type){
    return bus_type == 'Amusement park' ? '#1F78B4' :
    bus_type == 'Carnival or rental'  ? '#2CA02C' :
    bus_type == 'Family entertainment center'  ? '#D72728' :
    bus_type == 'Water park'  ? '#D72728' :
    bus_type == 'Pool waterslide'  ? '#8C564B' :
    bus_type == 'Zoo or museum' ? '#E477C2' :
    bus_type == 'Mall, store or restaurant' ? '#7F7F7F' :
    bus_type == 'Sports or recreation facility'? '#BCBD22' :
    bus_type == 'City or county park' ? '#1F77B4' :
    bus_type == 'Other' ? '#BCBD22' :
                '#FF7F0E';
}

function getBusTypesLayer(geodata) {
    // var layerData;
    var bus_type = d3.select("#selDataset").property("value");
    var filteredData = L.geoJSON(geodata, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, lnglat) {
            return L.circleMarker(lnglat, {
                radius: raidusScale(feature.properties.num_injured),
                fillColor: chooseColor(feature.properties.bus_type),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpactiy: 1
            });

        },
        filter: function (feature, layer) {
            return feature.properties.bus_type == bus_type;
        }
    })

    return filteredData;
}

function filterData(data) {
    var bus_type = d3.select("#selDataset").property("value");
    var filtered = data["accidents"].filter(accident => accident.bus_type == bus_type);
    return filtered;
}

function updateMap(geodata) {
    if (markerLayer) {
        myMap.removeLayer(markerLayer);
    }
    markerLayer = getBusTypesLayer(geodata);
    myMap.addLayer(markerLayer);
}

function plotScatterBusType(data) {
    // Create arrays 
    var xData = [];
    var yData = [];

    var parseTime = d3.timeParse("%m/%d/%Y");

    data["accidents"].forEach(function (data) {
        if (data.bus_type && data.date) {
            data.date = parseTime(data.date);
            xData.push(data.date);
            yData.push(data.bus_type);
        }
    });

    /////// Adding colors to al of the plots
    var trace = []
    var device = []

    for (let i = 0; i < xData.length; i += 1) {
        if (device.indexOf(yData[i]) === -1) {
            trace.push({
                x: [],
                y: [],
                mode: 'markers',
                name: yData[i],
                type: 'scatter'

            });
            device.push(yData[i]);
        } else {
            trace[device.indexOf(yData[i])].x.push(xData[i]);
            trace[device.indexOf(yData[i])].y.push(yData[i]);
        }
    }

    var layout = {
        title: 'Number of Incidents per Business Type, 1986-2009',
        showlegend: false,
        margin: {
            l: 200,
            b: 100
        }
    };

    Plotly.newPlot('scatter2', trace, layout);
}

function plotScatterBusTypeDeviceType(data) {
    // Create arrays 
    var xData = [];
    var yData = [];
    var selected_bus_type = d3.select("#selDataset").property("value");
    var filtered = filterData(data);


    filtered.forEach(function (data) {
        if (data.bus_type && data.num_injured < 80) {
            xData.push(data.device_type);
            yData.push(data.num_injured);

        }
    });


    /////// Adding colors to all of the plots
    var trace = [{
        x: xData,
        y: yData,
        mode: "markers",
        type: "scatter"
    }]

    var layout = {
        title: `Number of Injuries per Ride Type at ${selected_bus_type}s`,
        showlegend: false,
        margin: {
            b: 200
        },
        xaxis: {
            tickangle: 45
        }
    };

    Plotly.newPlot('scatter', trace, layout);
}

function plotBar(data) {

    // Create arrays 
    var xData = [];
    var yData = [];

    data["accidents"].forEach(function (data) {
        if (data.bus_type && data.num_injured) {
            yData.push(data.num_injured);
            xData.push(data.bus_type);
        }
    });

    var trace1 = {
        x: xData,
        y: yData,
        type: "bar"
    };

    var data = [trace1];

    var layout = {
        title: 'Business Type & Total Number Injured from 1986-2009',
        showlegend: false,
        height: 600,
        width: 600,
        margin: {
            b:200
        }
    };

    Plotly.newPlot('bar', data, layout);
}


function mapInit(geodata) {
    updateMap(geodata);
}

function plotInit(data) {
    plotScatterBusType(data);
    plotScatterBusTypeDeviceType(data);
    plotBar(data);
}



function optionChanged() {
    d3.json(city_url).then(function (response) {
        mapInit(response.features);
    });
    d3.json(api_url).then(data => plotScatterBusTypeDeviceType(data))
    
}