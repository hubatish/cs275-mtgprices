if (Meteor.isClient) {
    /*
    //Installing this require package is gonna be tough
    var request = require("request");

    request("https://www.kimonolabs.com/api/9utlkdbm?apikey=oUcgS30F1zkYScmzLUrafSwZ6SjPUTZp", 
        function(err, response, body) {
            console.log(body);
            console.log("Respone:"+response);
    });*/
    
    // This code only runs on the client
    Template.body.helpers({
    tasks: [
        { text: "This is task 1" },
        { text: "This is task 2" },
        { text: "This is task 3" }
    ]
    });
}