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


// /*Accidents/time, Device type/accidents, Business type/accident, name/accidents */

//Barchart

// Function to display the plot
function plotBar(data) {
  
  // Create arrays 
  var xData = [];
  var yData = [];

  var device_type = data[device_type];
  var parseTime = d3.timeParse("%m/%d/%Y");

  data["accidents"].forEach(function(data){
    if (data.device_type && data.num_injured){
      xData.push(data.num_injured);
      yData.push(data.bus_type);
    }
  });

  console.log(xData);
  console.log(yData);

  var trace1 = {
    x: xData,
    y: yData,
    type: 'bar'
  };
  
  
  var data = [trace1];
  
  var layout = {barmode: 'group'};
  
  Plotly.newPlot('chartDiv', data, layout);
}


// //SCATTER PLOT WITH HOVER TEXT//


function plotScatter(data) {
  
  // Create arrays 
  var xData = [];
  var yData = [];
  

  var device_type = data[device_type];
  var parseTime = d3.timeParse("%m/%d/%Y");

  data["accidents"].forEach(function(data){
    if (data.device_type && data.date){
        data.date = parseTime(data.date);
      xData.push(data.date);
      yData.push(data.device_type);
    }
  });

  console.log(xData);
  console.log(yData);
/////// Adding colors to al of the plots
  var trace = []
  var device = []

  for (let i = 0; i < xData.length; i += 1) {
    if (device.indexOf(yData[i]) === -1) {
        trace.push({ x: [],
                     y: [],
                     mode: 'markers',
                     name: yData[i],
                     type:'scatter',
                     title: 'Ride type and injries'
              
                    });
        device.push(yData[i]);
  } else {
        trace[device.indexOf(yData[i])].x.push(xData[i]);
        trace[device.indexOf(yData[i])].y.push(yData[i]);
  }
}
console.log(trace)
Plotly.newPlot('scatterDiv', trace);


};
  // Creating Trace

//   var trace = {
//     x: xData,
//     y: yData,
//     mode: 'markers',
//     type: 'scatter',
//     text: [''],
//     marker: { size: 5 },
//     color: "size"
//   };
  
//   var data = [trace];
  
//   var layout = {
    
//     title:'Accidents Vs Type of Amusement Park'
//   };
  
//   Plotly.newPlot('scatterDiv', data, layout);
//   // Return data to form chart
//   return data;
 //}

function updatePlot(data) {
  var chartData = plotScatter(data);

  // Use `Plotly.react()` to update plot
  Plotly.react("scatterDiv", chartData);
}

////Bubblechart/// //Device type ///nno


// function plotBubble(data) {
  
//   // Create arrays 
//   var xData = [];
//   var yData = [];
//   var device_category = [];
//   var trademarkname_or_generic = [];

//   var device_type = data[device_type];
//   var parseTime = d3.timeParse("%m/%d/%Y");

//   data["accidents"].forEach(function(data){
//     if (data.device_type && data.num_injured){
//       xData.push(data.num_injured);
//       yData.push(data.bus_type);
//     }
//   });

//   console.log(xData);
//   console.log(yData);

//   var trace1 = {
//     x: xData,
//     y: yData,
//     text: [''],
//     mode: 'markers',
//     marker: {
//       color: ['rgb(93, 164, 214)'],
//       size: [20,40,60]
//     }
//   };
  
//   var data = [trace1];
  
//   var layout = {
//     title: 'Event type & Number injured',
//     showlegend: false,
//     height: 600,
//     width: 600
//   };
  
//   Plotly.newPlot('bubbleDiv', data, layout);
// }

// Function to create initial chart
function init(data) {
  plotBar(data);
  plotScatter(data);
 

}

// On change to the DOM, call updatePlot()
d3.selectAll("selDataset").on("change", updatePlot);