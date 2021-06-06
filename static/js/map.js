const PREFIX = "https://park-accidents-api.herokuapp.com/"


d3.json(`${PREFIX}/api/v1.0/accident_location_state`).then(function(data){
    console.log(data);
});