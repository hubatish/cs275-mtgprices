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
            return CArchetype.find({});
        }
    });
}
else {
    Meteor.publish("deckSub",function(link) {
        //Clear old collection (problem: only gets called on server start...)
        CDeck.remove({});
        //Archetype.insert({"hello":"more" + link});
        //console.log("looking at name: "+link);
        var allDecks = Decks.find({name:link}).fetch();
        //console.log("uh.. returend: "+JSON.stringify(allDecks));
        //console.log("publish called, results reterune: "+allDecks.length);
        for(var i=0;i<allDecks.length;i++){
            //console.log("deck: "+deck.name);
            //console.log("deck: "+JSON.stringify(allDecks[i]));
            CDeck.insert(allDecks[i]);
        }
        return CDeck.find({});
    });
}
