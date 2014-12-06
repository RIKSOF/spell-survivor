HomeView = Backbone.View.extend({
	
	initialize: function( options ){
		this.render();
	},
	
	render: function(){
		var template = _.template($('#homeTemplate').html(), {});
		this.$el.html(template);
	},
	
	events: {
		"click .options li a":"clickOption"
	},
	
	clickOption: function (e) {
		e.preventDefault();
		var selectOpt = e.currentTarget.innerHTML;
		app.pubnubPublish(app.question.get("id"),selectOpt);
	}
});