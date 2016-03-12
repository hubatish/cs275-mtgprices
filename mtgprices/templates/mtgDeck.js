//purely for getting info to the client on this page
CDeck = new Mongo.Collection("CDeck")

if (Meteor.isClient) {
    // This code only runs on the client
    Template.mtgSDeck.helpers( {
        deckGetC: function() {
            console.log("Getting decks");
            return CDeck.find({});
        }
    });
    Template.mtgSDeck.onRendered(function () {
        console.log("Rendered");
        tappedOut();
    });
}
else {
    Meteor.publish("deckSub",function(link) {
<<<<<<< HEAD
        //console.log("looking at name: "+link);
        link = "http://mtgtop8.com/event?e=11615&d=266108&f=MO"; //hard coded example
=======
        //console.log("looking at deck link: "+link);

        if(link=='d'){
            //should get first deck automatically
            return CDeck.find({});
        }

        //link = "http://mtgtop8.com/event?e=11630&d=266244&f=MO"; //hard coded example
>>>>>>> 784fba8d9c426c81de9c77578d165b8a39567779

        CDeck.remove({});
        var allDecks = Decks.find({_id: String(link)}).fetch();

        //Should only return 1
<<<<<<< HEAD
        console.log("Got back this many decks for query: "+allDecks.length);
=======
        console.log("Got back this many decks for query: "+allDecks.length + "from link: "+link);
>>>>>>> 784fba8d9c426c81de9c77578d165b8a39567779
        var deck = allDecks[0];
        console.log("Json: " + JSON.stringify(allDecks));
        for(var i=0;i<deck.cards.length;i++){
            console.log("c:"+deck.cards[i].name);
            CDeck.insert(deck.cards[i]);
        }
        return CDeck.find({});
    });
}
