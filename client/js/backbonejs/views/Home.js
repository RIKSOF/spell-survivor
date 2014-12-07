HomeView = Backbone.View.extend({
	
	audioTheme : document.createElement('audio'),
	timeOut: new Array(),
	timeCount:0,
	AnimateObj: new Array(),
	AnimateCounter:0,
	
	initialize: function( options ){
		this.render();
	},
	
	render: function(){
		var template = _.template($('#homeTemplate').html(), {});
		this.$el.html(template);
		
		this.initAnimation();
	},
	
	events: {
		"click .options li a":"clickOption",
		"click .skipbutton":"skipAnimation"
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
	
	//handle variable if already clicked
	clickDisable: false,
	
	clickOption: function (e) {
		if ( !this.clickDisable ) {
			e.preventDefault();
			
			var selectOpt = e.currentTarget.innerHTML;
			app.pubnubPublish(app.question.get("id"),selectOpt);
			
			app.resetAudio();
			this.clickDisable = true;
		}
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
				
				// init the quiz
				app.pubnubInit();
				
			});
	},
	
	finishAnimation: function(){
		var _home = this;
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
//			_home.AnimateObj[_home.AnimateCounter++] = _home.loadPlank();
		},48000);
	}
	
});