//purely for getting info to the client on this page
CDeck = new Mongo.Collection("CDeck")
Price = new Mongo.Collection("Price")
Name = new Mongo.Collection("Name")


if (Meteor.isClient) {
    // This code only runs on the client
    Template.mtgSDeck.helpers( {
        deckGetC: function() {
            console.log("Getting decks");
            return CDeck.find({});
        },
        deckGetPrice: function() {
          return Price.findOne();
        },
        deckGetName: function() {
          return Name.findOne();
        }
    });
    Template.mtgSDeck.onRendered(function () {
        console.log("Rendered");
        tappedOut();
    });
}
else {
    Meteor.publish("deckSub",function(link) {
        //console.log("looking at name: "+link);
        link = "http://mtgtop8.com/event?e=11615&d=266108&f=MO"; //hard coded example
        //console.log("looking at deck link: "+link);

        if(link=='d'){
            //should get first deck automatically
            return [CDeck.find({}), Price.find(), Name.find()];
        }


        CDeck.remove({});
        Price.remove({});
        Name.remove({});
        var allDecks = Decks.find({_id: String(link)}).fetch();

        //Should only return 1
        //console.log("Got back this many decks for query: "+allDecks.length + "from link: "+link);
        var deck = allDecks[0];

        Name.insert({name: deck.name});
        Price.insert({price: deck.totalprice});

        for(var i=0;i<deck.cards.length;i++){
            //console.log("c:"+deck.cards[i].name);
            CDeck.insert(deck.cards[i]);
        }
        return [CDeck.find({}), Price.find(), Name.find()];
    });
}
