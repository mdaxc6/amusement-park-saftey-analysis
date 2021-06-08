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


/*#####Building plots###########*/


/*Accidents/time, Device type/accidents, Business type/accident, name/accidents */

// Function to display the plot
function plotData(data) {
  // Select the node using d3
  var selectNode = d3.select("selDataset");

  //var accident = selectNode.property("acc_date");


  var device_type = data[device_type];

  // Create arrays 
  var xData = Object.values(data.device_type);
  var yData = Object.values(data.acc_date);

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
  var chartData = plotData(data);

  // Use `Plotly.react()` to update plot
  Plotly.react("chartDiv", chartData);
}

// Function to create initial chart
function init(data) {
  var chartData = plotData(data);
  var layout = {height: 600, width:800};
  Plotly.newPlot("chartDiv", chartData, layout);
}

// On change to the DOM, call updatePlot()
d3.selectAll("selDataset").on("change", updatePlot);

