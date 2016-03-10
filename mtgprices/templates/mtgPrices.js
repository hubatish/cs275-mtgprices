//This will contain {name: ' ', link: ' ', avg price: '$$', decks: [unique id for each deck]}
Archetypes = new Mongo.Collection("archetypes") //contains the deck archetypes

//contains {name: ' ', link: ' ', total price: ' ', cards:[card names]}
Decks = new Mongo.Collection("Decks") //contains the actual decks

if (Meteor.isClient) {
    Meteor.subscribe("mtgPricesSubscribe");
    // This code only runs on the client
    Template.mtgprices.helpers({
        archetypes: function() {
            return Archetypes.find({});
        }
    });
}
else{
    var listOfArchetypes = Archetypes.find({}).fetch();
    //if (listOfArchetypes.length == 0) { //TODO: Check this based on date
    if (true) { //TODO: Check this based on date
        Archetypes.remove({});

        var Firebase = Npm.require("firebase"); // This is the syntax for setting up a npm package in meteor
        var mtgArchTypes = new Firebase("https://dazzling-torch-1073.firebaseio.com/kimono/api/9utlkdbm/latest/results/archetypes/");
        var mtgDecks = new Firebase("https://dazzling-torch-1073.firebaseio.com/kimono/api/5c0jgyls/latest/results/decks/");

        //Todo list:
        //Need to crawl the 3rd one
        //Then put the
        mtgDecks.on("value", Meteor.bindEnvironment(function(snapshot) {
            var deckList = snapshot.val();
            for (var i = 0; i < deckList.length; i++){
                var deckName = deckList[i].deck.text;
                var deckNameEncoded = encodeURIComponent();
                var deckLink = deckList[i].deck.href;

                var deckID = "foo";

                Decks.insert({
                    name: deckName,
                    nameEncoded: deckNameEncoded,
                    link: deckLink
                    //cards: [name of cards]
                    //avg price: $$
                })
            }
        }), function(errorObject){
            console.log("The read failed: " + errorObject.code);
        });

        mtgArchTypes.on("value", Meteor.bindEnvironment(function(snapshot) {
            var arch = snapshot.val();
            for (var i = 0; i < arch.length; i++){
                var archetypeName = arch[i].deck.html;
                var archetypeNameEncoded = encodeURIComponent(archetypeName);
                var archetypeLink = arch[i].deck.href;
                var archetypeDecks = _.pluck( Decks.find( { name: archetypeName } ).fetch(), '_id' );

                var archetypeID = "foo";

                Archetypes.insert({
                    name: archetypeName,
                    nameEncoded: archetypeNameEncoded,
                    link: archetypeLink,
                    decks: archetypeDecks
                    //avg price
                });
                console.log("inserting: " + archetypeName + ", " + archetypeNameEncoded, + ", " + archetypeLink);
            }
        }), function(errorObject){
            console.log("The read failed: " + errorObject.code);
        });
    }

    Meteor.publish("mtgPricesSubscribe", function() {
        return Archetypes.find({});
    });
}
