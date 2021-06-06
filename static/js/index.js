const PREFIX = "https://park-accidents-api.herokuapp.com/"


d3.json("https://park-accidents-api.herokuapp.com/api/v1.0/all_accidents").then(function(data){
    console.log(data);
});