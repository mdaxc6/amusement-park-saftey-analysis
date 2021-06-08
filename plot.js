const url = "https://park-accidents-api.herokuapp.com/api/v1.0/all_accidents";

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);


/*#####Building plots###########*/


/*Accidents/time, Device type/accidents, Business type/accident, name/accidents */

// Function to display the plot
function plotData() {
  // Select the node using d3
  var selectNode = d3.select("selDataset");

  var accident = selectNode.property("acc_date");


  var device_type = data[device_type];

  // Create arrays 
  var xData = Object.values(accident_data.device_type);
  var yData = Object.values(accident_data.acc_date);

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

function updatePlot() {
  var chartData = plotData();

  // Use `Plotly.react()` to update plot
  Plotly.react("chartDiv", chartData);
}

// Function to create initial chart
function init() {
  var chartData = plotData();
  var layout = {height: 600, width:800};
  Plotly.newPlot("chartDiv", chartData, layout);
}

// On change to the DOM, call updatePlot()
d3.selectAll("selDataset").on("change", updatePlot);

// Call `init()` function
init();