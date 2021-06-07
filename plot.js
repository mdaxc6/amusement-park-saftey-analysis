const url = "https://park-accidents-api.herokuapp.com/api/v1.0/all_accidents";

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);


/*#####Building plots###########*/


/*Accidents over time plot, Device type/accidents, Business type/accident, name/accidents*/

function buildplot(){
  d3.json(url).then(function(response) {
    var data = response.dataset.data;

  }
  
}
