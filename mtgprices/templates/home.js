Router.map(function () {
  this.route('Home', {
    path: '/',  //overrides the default '/home'
  });
  this.route('mtgprices', {
    path: '/mtgPrices'
  });
  this.route('/mtgSArch/:link',{ // Route takes a single parameter
    name: 'mtgSArch',
    waitOn: function(){
      return Meteor.subscribe('archSub', this.params.link);
    }
  });
});
