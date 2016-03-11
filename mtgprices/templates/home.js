globalArch = "";

Router.map(function () {
  this.route('Home', {
    path: '/',  //overrides the default '/home'
  });
  this.route('mtgprices', {
    path: '/mtgPrices'
  });
  this.route('/mtgSArch/:link/:deck',{ // Route takes a single paramete
   name: 'deckNArch',
      yieldTemplates: {
          'mtgSDeck': {to: 'mtgDecksTemp'},
          'mtgSArch': {to: 'mtgArchsTemp'}
      },
    waitOn: function(){
        console.log("Route waiting on mtgsarch");
        console.log("Deck? "+this.params.deck);
        return [Meteor.subscribe('archSub', this.params.link),Meteor.subscribe('deckSub', this.params.deck)];
    }
  });
    this.route('/mtgSDeck/:link', {
        // Route takes a single parameter
        name: 'mtgSDeck',
        waitOn: function() {
            Meteor.subscribe('deckSub', this.params.link);
            return;
        }
    });
});
