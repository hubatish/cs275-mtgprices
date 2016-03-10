var currentArch = "";


//purely for getting info to the client on this page
CArchetype = new Mongo.Collection("CArchetype")

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
    Template.mtgSArch.helpers( {
        archGetD: function() {
            return CArchetype.find({});
        }
    });
}
else {
    Meteor.publish("archSub",function(link) {
        //Clear old collection (problem: only gets called on server start...)
        CArchetype.remove({});
        //Archetype.insert({"hello":"more" + link});
        //console.log("looking at name: "+link);
        var allDecks = Decks.find({name:link}).fetch();
        //console.log("uh.. returend: "+JSON.stringify(allDecks));
        //console.log("publish called, results reterune: "+allDecks.length);
        for(var i=0;i<allDecks.length;i++){
            //console.log("deck: "+deck.name);
            //console.log("deck: "+JSON.stringify(allDecks[i]));
            CArchetype.insert(allDecks[i]);
        }
       //TODO: Make call to kimono/firelab to get data based off the link
       /*       var currentArch = ""
           //Make call to kimono and get all generic top8 info
           HTTP.call('GET', "http://" + currentArch,
                {},
                function(err, response) {
                    if(err){
                        console.log(err);
                    }
                    //got back JSON, parse it
                    var json = JSON.parse(response.content);
                    console.log(json.results);

                    //Get new collection
                    for(var i=0;i<deckTypes.length;i++){
                        //er, do something with this
                        //console.log("name"+deckTypes[i].deck.html+"url"+deckTypes[i].deck.href);
                    }
           });*/
        return CArchetype.find({});
    });
    console.log("server getting data: " + currentArch);
}
