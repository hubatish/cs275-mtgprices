//purely for getting info to the client on this page
CDeck = new Mongo.Collection("CDeck")
Price = new Mongo.Collection("Price")
CName = new Mongo.Collection("CName")


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
          return CName.findOne();
        },
        deckGetCPrice: function(){
          return CPrice.findOne();
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
        //console.log("looking at deck link: "+link);

        if(link=='d'){
            //should get first deck automatically
            return [CDeck.find({}), Price.find(), CName.find()];
        }


        CDeck.remove({});
        Price.remove({});
        CName.remove({});
        var allDecks = Decks.find({_id: String(link)}).fetch();

        //Should only return 1
        //console.log("Got back this many decks for query: "+allDecks.length + "from link: "+link);
        var deck = allDecks[0];

        CName.insert({deckName: deck.name});
        Price.insert({price: deck.totalprice});

        for(var i=0;i<deck.cards.length;i++){
            var nameofCard = deck.cards[i].name;
            //console.log("c:"+nameofCard);
            var price = _.pluck(Cards.find({name: nameofCard}).fetch(), 'price');
            //console.log("P:"+price[1]);
            deck.cards[i].price = price[1];
            console.log(deck.cards[i]);
            CDeck.insert(deck.cards[i]);
        }
        return [CDeck.find({}), Price.find(), CName.find()];
    });
}
