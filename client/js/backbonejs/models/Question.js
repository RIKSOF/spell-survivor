Question = Backbone.Model.extend({
	
	initialize: function() {
		this.on("change", function(model){
			
			var _attributes = model.attributes;
			app.home.$el.find("#options1").html(_attributes.options[0]);
			app.home.$el.find("#options2").html(_attributes.options[1]);
			app.home.$el.find("#options3").html(_attributes.options[2]);
			app.home.$el.find("#options4").html(_attributes.options[3]);
			
			// bring plank slots
			app.home.$el.find(".plank .options #options1").parent().animate({left:0},500);
			app.home.$el.find(".plank .options #options2").parent().animate({right:0},500);
			app.home.$el.find(".plank .options #options3").parent().animate({left:0},500);
			app.home.$el.find(".plank .options #options4").parent().animate({right:0},500);
			
			
			app.initCount();
			
			if ( _attributes.audioUrl != null ) {
				var url = _attributes.audioUrl;
				app.playSpelling(url);
			}
			
		});
	}
	
	
	
});