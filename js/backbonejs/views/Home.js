HomeView = Backbone.View.extend({
	
	initialize: function( options ){
		
	},
	
	render: function(){
		var content = $('#homeTemplate').html();
		var template = _.template(content);
		$(this.el).html(template());
	}
});