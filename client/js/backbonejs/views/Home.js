HomeView = Backbone.View.extend({
	
	audioClick : document.createElement('audio'),
	audioTheme : document.createElement('audio'),
	audioFastest : document.createElement('audio'),
	audioCorrect : document.createElement('audio'),
	audioIncorrect : document.createElement('audio'),
	timeOut: new Array(),
	timeCount:0,
	AnimateObj: new Array(),
	AnimateCounter:0,
	
	//handle variable if already clicked
	// by default it should be disabled, not let user to click on ... slots
	clickDisable: true,
	
	initialize: function( options ){
		this.render();
	},
	
	render: function(){
		var template = _.template($('#homeTemplate').html(), {});
		this.$el.html(template);
		
		this.audioClick.setAttribute('src', 'audio/bullet.mp3');
		this.initAnimation();
	},
	
	events: {
		"click .options li a":"clickOption",
		"click .skipbutton":"skipAnimation",
		"click #howtoplay":"howtoPlay",
		"click .clickSound":"clickSound",
		"click #correctsample":"correctSound",
		"click #incorrectsample":"incorrectSound",
		"click #fastestsample":"fastestSound",
		"click .backbutton":"backtoMenu",
		"click #startgame":"startGame",
	},
	
	skipAnimation : function() {
		//this.audioTheme.pause();
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
		if ( !this.clickDisable ) {
			
			this.animatePlank();
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
		_home.$el.find('.scoreboard').animate({left:0},500);
		_home.$el.find(".plank").animate({left:0},500,function(){
			_home.$el.find(".timerMain").animate({top:0},500);
				// init the quiz
				app.pubnubInit();
			});
	},
	
	finishAnimation: function(){
		var _home = this;
		$("body").css({opacity:1,background:"#b3cacf"});
		_home.$el.find('.river').css({marginTop:"80px"});
		_home.$el.find('.mountainsmall').css({height:"282px"});
		_home.$el.find('.mountainlarge').css({height:"445px"});
		_home.$el.find('.sky').css({opacity:0});
		_home.$el.find('.sun').css({top:"-500px",opacity:1});
		_home.$el.find('.mountainlarge').css({opacity:1});
		_home.$el.find('.mountainsmall').css({opacity:1});
		_home.$el.find('.mountainlargeshadow').css({height:"104px"});
		_home.$el.find('.mountainsmallshadow').css({height:"161px"});
		_home.titleAnimate();
		setTimeout(function(){
			_home.Mainmenu();
		},7000);
	},
	
	initAnimation: function () {
		//Audio theme start
		
		this.audioFastest.setAttribute('src', 'audio/sound.mp3');
		this.audioCorrect.setAttribute('src', 'audio/click.mp3');
		this.audioIncorrect.setAttribute('src', 'audio/cow.mp3');
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
				$("body").css("background","#b3cacf");
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
							_home.AnimateObj[_home.AnimateCounter++] = _home.$el.find('.mountainsmallshadow').animate({height:"161px"},9000,function(){
								$(".skipbutton").hide();	
							});
							
						},3000);
					});
				},3500);		
			});
		},3000);
		
		_home.timeOut[_home.timeCounter++] = setTimeout(function(){
			_home.AnimateObj[_home.AnimateCounter++] = _home.titleAnimate();
		},35000);
		
		
		_home.timeOut[_home.timeCounter++] = setTimeout(function(){
			 //_home.audioTheme.pause();
			_home.AnimateObj[_home.AnimateCounter++] = _home.$el.find('.mainmenu').animate({bottom:"30%"},500);
//			_home.AnimateObj[_home.AnimateCounter++] = _home.loadPlank();
		},43000);
	},
	
	animatePlank: function(){
		
		this.$el.find("#options1").parent().animate({left:'-350%'},500);
		this.$el.find("#options2").parent().animate({right:'-350%'},500);
		this.$el.find("#options3").parent().animate({left:'-350%'},500);
		this.$el.find("#options4").parent().animate({right:'-350%'},500);
	},
	
	Mainmenu: function(){
		this.$el.find('.mainmenu').animate({bottom:"30%"},500);
	},
	
	howtoPlay: function(){
		var _home = this;
		this.$el.find('.mainmenu').animate({bottom:"-220%"},500,function(){
			_home.$el.find(".plankhowto").animate({left:0},500,function(){
				_home.$el.find(".backbutton").show();
			});	
		});
		
	},
	
	backtoMenu:function(){
		var _home = this;
		this.$el.find(".backbutton").hide();
		this.$el.find(".plankhowto").animate({left:'-150%'},500,function(){
			_home.$el.find('.mainmenu').animate({bottom:"30%"},500);
		});
	},
	
	startGame:function(){
		this.audioTheme.pause();
		this.$el.find('.mainmenu').animate({bottom:"-220%"},500);
	},
	
	correctSound: function(){
		this.audioCorrect.play();
	},
	
	incorrectSound: function(){
		this.audioIncorrect.play();
	},
	
	fastestSound: function(){
		this.audioFastest.play();
	},
	
	clickSound: function(){
		this.audioClick.play();
	}
	
});