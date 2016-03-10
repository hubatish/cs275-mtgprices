Router.route('/mtgSDeck/:link', {
        // Route takes a single parameter
        name: 'mtgSDeck',
        waitOn: function() {
            return Meteor.subscribe('deckSub', this.params.link);
        }
});

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
}
else {
    Meteor.publish("deckSub",function(link) {
        link = "http://mtgtop8.com/event?e=11630&d=266244&f=MO"; //hard coded example
        //Clear old collection (problem: only gets called on server start...)
        CDeck.remove({});
        //console.log("looking at name: "+link);
        var allDecks = Decks.find({link:link}).fetch();
        //console.log("uh.. returend: "+JSON.stringify(allDecks));
        //console.log("publish called, results reterune: "+allDecks.length);
        var deck = allDecks[0];
        for(var i=0;i<deck.cards.length;i++){
            console.log("c:"+deck.cards[i].name);
            CDeck.insert(deck.cards[i]);
        }
        //console.log("deck: "+JSON.stringify(allDecks[i]));
        return CDeck.find({});
    });
}
