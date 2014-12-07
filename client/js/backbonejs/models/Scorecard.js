Scorecard = Backbone.Model.extend({
	
	initialize: function() {
		this.on("change", function(model){
			
			var _attributes = model.attributes;
			app.home.$el.find("#scoreboard").html(_attributes.points);
			
		});
	}
		
});