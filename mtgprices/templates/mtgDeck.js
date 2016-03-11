
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
        //console.log("looking at deck link: "+link);
        //link = "http://mtgtop8.com/event?e=11630&d=266244&f=MO"; //hard coded example

        CDeck.remove({});
        var allDecks = Decks.find({_id: String(link)}).fetch();

        //Should only return 1
        //console.log("Got back this many decks for query: "+allDecks.length);
        var deck = allDecks[0];
        for(var i=0;i<deck.cards.length;i++){
            //console.log("c:"+deck.cards[i].name);
            CDeck.insert(deck.cards[i]);
        }
        return CDeck.find({});
    });
}
