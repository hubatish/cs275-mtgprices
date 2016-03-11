//purely for getting info to the client on this page
CArchetype = new Mongo.Collection("CArchetype");

if (Meteor.isClient) {
    // This code only runs on the client
    Template.mtgSArch.helpers( {
        archGetD: function() {
            console.log("Getting arch d");
            //console.log("param sfrom archd: "+this.getParams());
            return CArchetype.find({});
        }
    });
}
else {
    Meteor.publish("archSub",function(link, callback) {
        //Clear old collection
        CArchetype.remove({});
        console.log("global arch: "+globalArch);
        console.log("arch looking at name: "+link);
        var allDecks = Decks.find({nameEncoded: encodeURIComponent(link)}).fetch();

        console.log("publish called, results reterune: "+allDecks.length);
        for(var i=0;i<allDecks.length;i++){
            //console.log("deck: "+deck.name);
            CArchetype.insert(allDecks[i]);
        }

        //do something with first deck
        //callback(allDecks[0]);

        console.log("publish, not sure what to do with data archetype");
        return CArchetype.find({});
    });
}
