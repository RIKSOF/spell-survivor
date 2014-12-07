HomeView = Backbone.View.extend({
	
	count: 0,
	
	initialize: function( options ){
		this.render();
	},
	
	render: function(){
		var template = _.template($('#homeTemplate').html(), {});
		this.$el.html(template);
		
		this.initAnimation();
		this.count = app.defaultCount;
	},
	
	events: {
		"click .options li a":"clickOption"
	},
	
	clickOption: function (e) {
		e.preventDefault();
		var selectOpt = e.currentTarget.innerHTML;
		app.pubnubPublish(app.question.get("id"),selectOpt);
	},
	
	initAnimation: function () {
		//Audio theme start
		var audioTheme = document.createElement('audio');
		audioTheme.setAttribute('src', 'audio/theme.mp3');
		audioTheme.setAttribute('autoplay', 'autoplay');
        //audioElement.load()
		
		var _home = this;
		
        $.get();

		audioTheme.addEventListener("load", function() {
			audioElement.play();
		}, true);

		audioTheme.play(); 
		//Audio theme end
        setTimeout(function(){
			$("body").animate({opacity:1},2000);
		},3000);
		setTimeout(function(){
			_home.$el.find('.river').animate({marginTop:"80px"},15000);
			_home.$el.find('.mountainsmall').animate({height:"282px"},15000);
			_home.$el.find('.mountainlarge').animate({height:"445px"},15000,function(){
				_home.$el.find('.sky').animate({opacity:0},12000);
				_home.$el.find('.sun').animate({top:"-500px",opacity:1},12000);
				_home.$el.find('.mountainlarge').animate({opacity:1},12000);
				_home.$el.find('.mountainsmall').animate({opacity:1},12000);
				setTimeout(function(){
					_home.$el.find('.mountainlargeshadow').animate({height:"104px"},9000);
					_home.$el.find('.mountainsmallshadow').animate({height:"142px"},9000);
				},3000);
			});
		},8500);
		
		var getFormData = function () {
			var data = { 
				loop: false, 
				in: { callback: "", effect: "bounceInDown", reverse: false, shuffle: true, sync: false }, 
				out: { callback: "", effect: "hinge", reverse: false, shuffle: true, sync: false }
			};
			return data;
		};
		setTimeout(function(){
			var $tlt = _home.$el.find('.logotext')
			  .on('start.tlt', '')
			  .on('inAnimationBegin.tlt', '')
			  .on('inAnimationEnd.tlt', '')
			  .on('outAnimationBegin.tlt', '')
			  .on('outAnimationEnd.tlt', '')
			  .on('end.tlt', '');
			
			var obj = getFormData();
			$tlt.textillate(obj);
		},35000);
		setTimeout(function(){
			audioTheme.pause();
			_home.$el.find(".plank").animate({left:0},500,function(){
				_home.$el.find(".timerMain").animate({top:0},500);
				
				//Quiz Voice start
//				var audioElement = document.createElement('audio');
//				audioElement.setAttribute('src', 'http://media.tts-api.com/0190e761bba7bf93fac099718ddb33fd9b3bea1f.mp3');
//				audioElement.setAttribute('autoplay', 'autoplay');
//				//audioElement.load()
//				audioElement.addEventListener("load", function() {
//            		audioElement.play();
//				}, true);
//				setInterval(function(){ 
//					if(counting.Timer.isActive)
//						audioElement.play(); 
//				}, 5000);
				// Quiz voice end
				
				// init the quiz
				app.pubnubInit();
				_home.initCount();
				
			});
			_home.$el.find(".cactus").animate({right:0},500);
		},48000);
	},
	
	initCount: function () {
		var _home = this;
		
		_home.$el.find("#countdown").val(_home.count);
		
		setInterval(function () {
			
			_home.$el.find("#countdown").html(_home.count--);
			if (_home.count <= 0) {
				_home.count = app.defaultCount;
			}
		},1000);
		
	}
	
});