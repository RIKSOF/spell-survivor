HomeView = Backbone.View.extend({
	audioTheme : document.createElement('audio'),
	timeOut: new Array(),
	timeCount:0,
	AnimateObj: new Array(),
	AnimateCounter:0,
	
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
		"click .options li a":"clickOption",
		"click .skipbutton":"skipAnimation",
		"click .options a":"animatePlank"
	},
	
	skipAnimation : function() {
		this.audioTheme.pause();
		$(".skipbutton").hide();
		$.each( this.timeOut, function( key, value ) {
 			clearTimeout(value);
		});
		
		$.each( this.AnimateObj, function( key, value ) {
 			value.stop();
		});
		
		this.finishAnimation();
	},
	
	clickOption: function (e) {
		e.preventDefault();
		var selectOpt = e.currentTarget.innerHTML;
		app.pubnubPublish(app.question.get("id"),selectOpt);
	},
	
	titleAnimate:function(){
		var _home = this;
		var getFormData = function () {
			var data = { 
				loop: false, 
				in: { callback: "", effect: "bounceInDown", reverse: false, shuffle: true, sync: false }, 
				out: { callback: "", effect: "hinge", reverse: false, shuffle: true, sync: false }
			};
			return data;
		};
		
		var $tlt = _home.$el.find('.logotext')
		  .on('start.tlt', '')
		  .on('inAnimationBegin.tlt', '')
		  .on('inAnimationEnd.tlt', '')
		  .on('outAnimationBegin.tlt', '')
		  .on('outAnimationEnd.tlt', '')
		  .on('end.tlt', '');
		
		var obj = getFormData();
		$tlt.textillate(obj);	
	},
	
	loadPlank: function(){
		var _home = this;
		_home.$el.find(".cactus").animate({right:0},500);
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
	},
	
	finishAnimation: function(){
		var _home = this;
		$("body").css({opacity:1});
		_home.$el.find('.river').css({marginTop:"80px"});
		_home.$el.find('.mountainsmall').css({height:"282px"});
		_home.$el.find('.mountainlarge').css({height:"445px"});
		_home.$el.find('.sky').css({opacity:0});
		_home.$el.find('.sun').css({top:"-500px",opacity:1});
		_home.$el.find('.mountainlarge').css({opacity:1});
		_home.$el.find('.mountainsmall').css({opacity:1});
		_home.$el.find('.mountainlargeshadow').css({height:"104px"});
		_home.$el.find('.mountainsmallshadow').css({height:"142px"});
		_home.titleAnimate();
		setTimeout(function(){
			_home.loadPlank();
		},8000);
	},
	
	initAnimation: function () {
		//Audio theme start
		
        this.audioTheme.setAttribute('src', 'audio/theme.mp3');
        this.audioTheme.setAttribute('autoplay', 'autoplay');
        //audioElement.load()
		
		var _home = this;
		
        $.get();

        this.audioTheme.addEventListener("load", function() {
            this.audioTheme.play();
        }, true);

		this.audioTheme.play(); 
		//Audio theme end
        
		_home.timeOut[_home.timeCounter++] = setTimeout(function(){
			_home.AnimateObj[_home.AnimateCounter++] = $("body").animate({opacity:1},2000,function(){
				
				_home.timeOut[_home.timeCounter++] = setTimeout(function(){
					_home.AnimateObj[_home.AnimateCounter++] = _home.$el.find('.river').animate({marginTop:"80px"},15000);
					_home.AnimateObj[_home.AnimateCounter++] = _home.$el.find('.mountainsmall').animate({height:"282px"},15000);
					_home.AnimateObj[_home.AnimateCounter++] = _home.$el.find('.mountainlarge').animate({height:"445px"},15000,function(){
						_home.AnimateObj[_home.AnimateCounter++] = _home.$el.find('.sky').animate({opacity:0},12000);
						_home.AnimateObj[_home.AnimateCounter++] = _home.$el.find('.sun').animate({top:"-500px",opacity:1},12000);
						_home.AnimateObj[_home.AnimateCounter++] = _home.$el.find('.mountainlarge').animate({opacity:1},12000);
						_home.AnimateObj[_home.AnimateCounter++] = _home.$el.find('.mountainsmall').animate({opacity:1},12000);
						_home.timeOut[_home.timeCounter++] = setTimeout(function(){
							_home.AnimateObj[_home.AnimateCounter++] = _home.$el.find('.mountainlargeshadow').animate({height:"104px"},9000);
							_home.AnimateObj[_home.AnimateCounter++] = _home.$el.find('.mountainsmallshadow').animate({height:"142px"},9000);
							$(".skipbutton").hide();
						},3000);
					});
				},3500);		
			});
		},3000);
		
		_home.timeOut[_home.timeCounter++] = setTimeout(function(){
			_home.AnimateObj[_home.AnimateCounter++] = _home.titleAnimate();
		},35000);
		
		
		_home.timeOut[_home.timeCounter++] = setTimeout(function(){
			_home.audioTheme.pause();
			_home.AnimateObj[_home.AnimateCounter++] = _home.loadPlank();
		},48000);
	},
	
	initCount: function () {
		var _home = this;
		
		_home.$el.find("#countdown").val(_home.count);
		
		setInterval(function () {
			_home.$el.find("#countdown").html(_home.count--);
			_home.$el.find(".timerMain").animate({ top: "-10px" }, 200, function() {
			  $(this).animate({ top: "0px" }, 100 );
			});
			if (_home.count <= 0) {
				_home.count = app.defaultCount;
			}
		},1000);
		
	},
	
	animatePlank: function(){
		var _home = this;
		_home.$el.find("#options1").parent().animate({left:'-350%'},500);
		_home.$el.find("#options2").parent().animate({right:'-350%'},500);
		_home.$el.find("#options3").parent().animate({left:'-350%'},500);
		_home.$el.find("#options4").parent().animate({right:'-350%'},500,function(){
			app.pubnubInit();
		});
		setTimeout(function(){
			_home.$el.find(".plank .options #options1").parent().animate({left:0},500,function(){
				_home.$el.find(".timerMain").animate({top:0},500);
				app.defaultCount;
			});
			_home.$el.find(".plank .options #options2").parent().animate({right:0},500);
			_home.$el.find(".plank .options #options3").parent().animate({left:0},500);
			_home.$el.find(".plank .options #options4").parent().animate({right:0},500);
		},1000);
	}
	
});