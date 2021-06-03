const PREFIX = "https://earthquake-api-v1.herokuapp.com/"


d3.json(`${PREFIX}https://api/v1.0/earthquakes`).then(function(data){
    console.log(data);
});