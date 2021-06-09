const url = "https://park-accidents-api.herokuapp.com/api/v1.0/all_accidents";

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
  // Call `init()` function
  init(data);
});

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);


//PLOTS//


/*Accidents/time, Device type/accidents, Business type/accident, name/accidents */

// Function to display the plot
function plotBar(data) {
  
  // Create arrays 
  var xData = [];
  var yData = [];

  var device_type = data[device_type];

  data["accidents"].forEach(function(data){
    if (data.device_type && data.date){
    if(data.device_type && data.date){
      xData.push(data.device_type);
      yData.push(data.date);
    }
  }});

  console.log(xData);
  console.log(yData);
  // // Create arrays 
  // var xData = Object.values(accident_data.device_type);
  // var yData = Object.values(accident_data.acc_date);

  // Create a trace using the platform keys and values
  var trace = {
      x: xData,
      y: yData,
      type: "bar"
  };

  var chartData = [trace];

  // Return data to form chart
  return chartData;
}

function updatePlot(data) {
  var chartData = plotBar(data);

  // Use `Plotly.react()` to update plot
  Plotly.react("chartDiv", chartData);
}

//SCATTER PLOT WITH HOVER TEXT//


function plotBar(data) {
  
  // Create arrays 
  var xData = [];
  var yData = [];
  var device_category = [];
  var trademarkname_or_generic = [];

  var device_type = data[device_type];

  data["accidents"].forEach(function(data){
    if (data.device_type && data.date){
      xData.push(data.bus_type);
      yData.push(data.date);
    }
  });

  console.log(xData);
  console.log(yData);

  // Creating Trace

  var trace = {
    x: xData,
    y: yData,
    mode: 'markers',
    type: 'scatter',
    name: '',
    text: ['', ],
    marker: { size: 12 }
  };
  
  var data = [trace];
  
  var layout = {
    xaxis: {
      range: [ 0.75, 5.25 ]
    },
    yaxis: {
      range: [0, 8]
    },
    title:'Accidents Vs Type of Amusement Park'
  };
  
  Plotly.newPlot('myDiv', data, layout);
  // Return data to form chart
  return chartData;
}

function updatePlot(data) {
  var chartData = plotData(data);

  // Use `Plotly.react()` to update plot
  Plotly.react("chartDiv", chartData);
}

// Function to create initial chart
function init(data) {
  plotBar(data);
  plotScatter(data);

}
// New plot


// On change to the DOM, call updatePlot()
d3.selectAll("selDataset").on("change", updatePlot);

