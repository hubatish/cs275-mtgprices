if (Meteor.isClient) {
    /*
    //Installing this require package is gonna be tough
    var request = require("request");

    request("https://www.kimonolabs.com/api/9utlkdbm?apikey=oUcgS30F1zkYScmzLUrafSwZ6SjPUTZp", 
        function(err, response, body) {
            console.log(body);
            console.log("Respone:"+response);
    });*/
    
    // This code only runs on the client
    Template.body.helpers({
    tasks: [
        { text: "This is task 1" },
        { text: "This is task 2" },
        { text: "This is task 3" }
    ]
    });
}
else{    
    //Make call to kimono and get all generic top8 info
    HTTP.call('GET',"https://www.kimonolabs.com/api/9utlkdbm?apikey=oUcgS30F1zkYScmzLUrafSwZ6SjPUTZp", 
        {},
        function(err, response) {
            if(err){
                console.log(err);
            }
            //got back JSON, parse it
            var json = JSON.parse(response.content);
            var deckTypes = json.results.archetypes;
            console.log("decktypes len:"+deckTypes.length);
            for(var i=0;i<deckTypes.length;i++){
                //er, do something with this
                console.log(deckTypes[i].deck.html);
            }
    });
}