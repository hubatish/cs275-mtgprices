var currentArch = "";

/*Router.route('/mtgSArch', function () {
  this.render('mtgSArch', {});
  /*var params = this.params; // { _id: "5" }
  currentArch = params.link; // "5"
  console.log("got param: "+currentArch);
  if(Meteor.isServer){
      console.log("running server code here");
  }
});*/
/*Router.route('/mtgSArch/:link',{ // Route takes a single parameter
  name: 'mtgSArch',
  waitOn: function(){
    return Meteor.subscribe('archSub', this.params.link);
  }
});*/

/*{
  template: 'mtgSArch',
  data: function() {
    currentArch = this.params.link;
    console.log(currentArch);
  }
});*/

Archetype = new Mongo.Collection("archetype")

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
    Template.mtgSArch.helpers({
        archGetD: function () {
            return Archetype.find({});
        }
    });
}
else{
    //Clear old collection (problem: only gets called on server start...)
    Archetype.remove({});

    Meteor.publish("archSub",function(link){
       Archetype.insert({"hello":"more"+link});
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
       return Archetype.find({});
    });
    console.log("server getting data: "+currentArch);
/*
*/
}
