Cards = new Mongo.Collection("Cards");

getCardPrice = function(cardName, callback) {
    //TODO: cache this card in a database & return it if it exists
    var matchingCards = Cards.find({name:cardName}).fetch();
    if (matchingCards.length == 0) {
        //TODO: Parse out problem characters
        cardName = cardName.replace("/","//"); //Wear / Tear -> Wear // Tear
        cardName = cardName.replace(decodeURIComponent('%C3%86'),"Ae"); //Æther Vial -> Aether Vial

        var baseURL = "http://partner.tcgplayer.com/x3/phl.asmx/p?pk=JOHNWANG&s=&p=";

        HTTP.call('GET', baseURL + cardName,//"Flameborn%20Viron",
                  {},
                  function(err, response) {
                      if (err) {
                          //console.log(err);
                          console.log("Error, Product not found, inserting: " + cardName);
                          Cards.insert({name:cardName, price:0});
                          callback(0);
                          return;
                      }
                      //got back XML, parse it
                      xml2js.parseString(response.content, function (jsError, jsResult) {
                          var card = jsResult.products.product[0];
                          //console.log('xml to js',JSON.stringify(card));

                          //insert into cards
                          //sample {name:"Greed",price:4.3}
                          //TODO: Add date modified to card price
                          Cards.insert({name:cardName, price:card.avgprice});

                          callback(card.avgprice);
                      });
                  });
    }
    else {
        //console.log("Cached"+JSON.stringify(matchingCards[0]));
        callback(matchingCards[0].price);
    }
};
