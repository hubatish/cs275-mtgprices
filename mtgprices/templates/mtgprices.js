Router.route('/mtgprices', function () {
  this.render('mtgprices', {});
});

Archetypes = new Mongo.Collection("archetypes")

if (Meteor.isClient) {
    // This code only runs on the client
    Template.mtgprices.helpers({
        archetypes: function () {
            return Archetypes.find({});
        }
    });
}
else{

    var Firebase = Npm.require("firebase"); // This is the syntax for setting up a npm package in meteor
    //loop through the 0
    var mtgtop2Cnt = new Firebase("https://dazzling-torch-1073.firebaseio.com/kimono/api/9utlkdbm/latest");
    mtgtop2Cnt.on("value", function(snapshot){
      var temp = snapshot.val();
      var count = temp.count;
      for (var i = 0; i < count; i++){
        var mtgtop2Ref = new Firebase("https://dazzling-torch-1073.firebaseio.com/kimono/api/9utlkdbm/latest/results/archetypes/" + i + "/deck");
        mtgtop2Ref.on("value", function(snapshot){
          var decks = snapshot.val();
          var deckType = decks.html;
          console.log("deckType: " + deckType);
        }, function(errorObject){
          console.log("The read failed: " + errorObject.code);
        });
      }
    }, function(errorObject){
      console.log("The read failed: " + errorObject.code);
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
