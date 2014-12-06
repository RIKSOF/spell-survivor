Question = Backbone.Model.extend({
	
	defaults: {
		url: '',
		opts: {}
	},
	
	initialize: function() {
		this.on("change:opts", function(model){
			var _opts = model.get("opts");
			console.log(_opts);
		});
	}
	
	
	
});