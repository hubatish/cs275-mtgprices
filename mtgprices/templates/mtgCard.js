getCardPrice = function(cardName, callback){
    //TODO: cache this card in a database & return it if it exists
    
    //TODO: Parse out spaces from name, replace with %20
    
    var baseURL = "http://partner.tcgplayer.com/x3/phl.asmx/p?pk=JOHNWANG&s=&p=";
    
    HTTP.call('GET', baseURL + cardName,//"Flameborn%20Viron",
        {},
        function(err, response) {
            if(err){
                console.log(err);
            }
            //got back XML, parse it
            console.log("Str for card: "+response.content);
            xml2js.parseString(response.content, function (jsError, jsResult) {
                //console.error('errors',jsError);
                var card = jsResult.products.product[0];
                console.log('xml to js',JSON.stringify(card));
                console.log("avg price: "+card.avgprice);
                callback(card.avgprice);
            });
    });    
};

