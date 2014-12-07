Question = Backbone.Model.extend({
	
	initialize: function() {
		this.on("change", function(model){
			
			var _attributes = model.attributes;
			app.home.$el.find("#options1").html(_attributes.options[0]);
			app.home.$el.find("#options2").html(_attributes.options[1]);
			app.home.$el.find("#options3").html(_attributes.options[2]);
			app.home.$el.find("#options4").html(_attributes.options[3]);
			app.initCount();
			
			if ( _attributes.audioUrl != null ) {
				var url = _attributes.audioUrl;
		//		var audio = document.createElement('audio');
		//		audio.setAttribute('src', url);
		//		audio.setAttribute('autoplay', 'autoplay');
		//		audio.setAttribute('loop', true);
				var audio = new Audio(url);
				audio.play();
				var count = 0;
				var _interval = setInterval(function () {
					audio.play();
					if ( count == 1 ) {
						clearInterval(_interval);
					}
					count++;
				},5000);
			}
			
		});
	}
	
	
	
});