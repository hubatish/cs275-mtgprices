Router.map(function () {
  this.route('Home', {
    path: '/',  //overrides the default '/home'
  });
  this.route('/mtgprices', function () {
    this.render('mtgprices', {});
  });
  this.route('/mtgSArch/:link',{ // Route takes a single parameter
    name: 'mtgSArch',
    waitOn: function(){
      return Meteor.subscribe('archSub', this.params.link);
    }
  });
});
