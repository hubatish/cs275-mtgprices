Router.route('/mtgprices', function () {
  this.render('mtgprices', {});
});

Archetypes = new Mongo.Collection("archetypes")

if (Meteor.isClient) {
    Meteor.subscribe("mtgPricesSubscribe");

    // This code only runs on the client
    Template.mtgprices.helpers({
        archetypes: function () {
            return Archetypes.find({});
        }
    });
}
else{

    var Firebase = Npm.require("firebase"); // This is the syntax for setting up a npm package in meteor
    var mtgtop2Ref = new Firebase("https://dazzling-torch-1073.firebaseio.com/kimono/api/9utlkdbm/latest/results/archetypes/");
    mtgtop2Ref.on("value", Meteor.bindEnvironment(function(snapshot){
      var decks = snapshot.val();
      //console.log(decks);
      for (var i = 0; i < decks.length; i++){
        var deckType = decks[i].deck.html;
        var deckLink = decks[i].deck.href;
        Archetypes.insert({
          name: deckType,
          link: deckLink
        })
      }
    }), function(errorObject){
      console.log("The read failed: " + errorObject.code);
    });

    Meteor.publish("mtgPricesSubscribe", function() {
       return Archetypes.find({});
    });


    //Need to queue for top8 decks
      //Still some errors here, need to find out how to use Meteor.bindEnvironment
      /*
      Archetypes.insert({
        name: deckType,
        link: deckLink
      });
      */
}
