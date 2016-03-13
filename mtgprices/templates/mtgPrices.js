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
else {
    var listOfArchetypes = Archetypes.find({}).fetch();
    if (listOfArchetypes.length == 0) { //TODO: Check this based on date
        Decks.remove({});
        Archetypes.remove({});

        var Firebase = Npm.require("firebase"); // This is the syntax for setting up a npm package in meteor
        var mtgArchTypes = new Firebase("https://dazzling-torch-1073.firebaseio.com/kimono/api/9utlkdbm/latest/results/archetypes/");
        var mtgDecks = new Firebase("https://dazzling-torch-1073.firebaseio.com/kimono/api/5c0jgyls/latest/results/decks/");
        var mtgCards = new Firebase("https://dazzling-torch-1073.firebaseio.com/kimono/api/3668e6w0/latest/results");

        var populateCards = function() {
            mtgCards.on("value", Meteor.bindEnvironment(function (snapshot) {
                //console.log("snapshot: "+JSON.stringify(snapshot));
                var deckList = snapshot.val();
                //console.log("cards array: "+JSON.stringify(deckList));
                //console.log("do i have length???" + deckList.length);
                for (var i = 0; i < deckList.length; i++) {
                    var totalPrice = 0;
                    var totalCardsinDeck = 0;
                    //console.log("cards array: "+JSON.stringify(deckList[i]));
                    var cardNames = deckList[i].collection1;
                    var cardArray = [];
                    for (var j = 0; j < cardNames.length; j++) {
                        var card = cardNames[j].card;
                        var cardNum = Number(card.slice(0, 2).trim());
                        var cardName = card.slice(2, card.length);
                        totalCardsinDeck += cardNum;
                        getCardPrice(cardName, function(price){
                          totalPrice += (cardNum * price);
                        });
                        //console.log("num:" + cardNum);
                        var newCard = {name: cardName, number: cardNum};
                        cardArray.push(newCard);
                    }
                    totalPrice = totalPrice.toFixed(2);
                    var avgPrice = (totalPrice / totalCardsinDeck).toFixed(2);
                    //console.log("Total Price: " + totalPrice);
                    //console.log("Average Price: " + avgPrice);
                    var url = deckList[i].url;
                    //console.log("card array length: "+cardArray.length);
                    Decks.update({link: url},
                        {
                            $set: {
                                cards: cardArray,
                                totalprice: totalPrice,
                                avgprice: avgPrice
                            }
                        }
                    );
                }
            }), function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });
        };

        mtgArchTypes.on("value", Meteor.bindEnvironment(function(snapshot) {
            var arch = snapshot.val();
            for (var i = 0; i < arch.length; i++){
                var archetypeName = arch[i].deck.html;
                var archetypeNameEncoded = encodeURIComponent(archetypeName);
                var archetypeLink = arch[i].deck.href;
                var archetypeDecks = _.pluck( Decks.find( { name: archetypeName } ).fetch(), '_id' );

                // Grab the mtgtop8 ID for the archetype
                // e.g. http://mtgtop8.com/archetype?a=196&meta=51&f=MO
                var archetypeID = getParameterByName("a", archetypeLink);

                // Do an upsert
                Archetypes.update(
                    { _id: archetypeID },
                    {
                        // Use the archetype ID the primary key.
                        name: archetypeName,
                        nameEncoded: archetypeNameEncoded,
                        link: archetypeLink,
                        decks: archetypeDecks
                        //avg price
                    },
                    { upsert: true }
                );
                // console.log("a - inserting: " + archetypeName + ", " + archetypeNameEncoded + ", " + archetypeLink + ", " + archetypeID);
            }
        }), function(errorObject){
            console.log("The read failed: " + errorObject.code);
        });

        mtgDecks.on("value", Meteor.bindEnvironment(function(snapshot) {
            var deckList = snapshot.val();
            for (var i = 0; i < deckList.length; i++){
                var deckName = deckList[i].deck.text;
                var deckNameEncoded = encodeURIComponent(deckName);
                var deckLink = deckList[i].deck.href;

                var deckID = getParameterByName("d", deckLink);

                // Do an upsert
                Decks.update(
                    { _id: deckID },
                    {
                        name: deckName,
                        nameEncoded: deckNameEncoded,
                        link: deckLink,
                    },
                    { upsert: true }
                );
                //console.log("d - inserting: " + deckName + ", " + deckNameEncoded + ", "
                //            + deckLink + ", " + deckID);
            }
            populateCards();
        }), function(errorObject){
            console.log("The read failed: " + errorObject.code);
        });

    }

    Meteor.publish("mtgPricesSubscribe", function() {
        return Archetypes.find({});
    });
}

// From stackoverflow
function getParameterByName(name, url) {
    url = url.toLowerCase(); // This is just to avoid case sensitiveness
    name = name.replace(/[\[\]]/g, "\\$&").toLowerCase(); // This is just to avoid case sensitiveness for query parameter name
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
