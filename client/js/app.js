// JavaScript Document

var app = {
	
	// views
	home: null,
	
	// pubnub
	pubnub: null,
	
	// router
	router: null,
	
	// counter
	defaultCount: 15,
	
	// current message
	currentMessage:null,
	
	// pubnub creds
	publishKey: 'demo',
	subscribeKey: 'demo',
	channel: "spell-survivor-level1-game",
	
	question: null,
	scoreCard: null,
	
	init: function () {
		app.router = new AppRouter();
		Backbone.history.start();
		this.question = new Question();
		this.scoreCard = new Scorecard();
		
	//	this.pubnubInit();
	
	},
	
	pubnubInit: function (){
		// called from Home.js when StartGame
		this.pubnub = PUBNUB.init({
			publish_key: this.publishKey,
			subscribe_key: this.subscribeKey
		});
		this.pubnubSubscribe();
	},
	
	pubnubSubscribe: function () {
		this.pubnub.subscribe({
			channel  : this.channel,
			callback : function(message) {
				console.log(message);
				if ( message.sender == "server" ) {
					
					//
					app.home.animatePlank(true);
					// set current answer
					currentMessage = message;
					
					// first reset the counter
					app.resetCount();
					
					// if audio still left .. reset
					app.resetAudio();
					
					// set variable to false to enable click on screen
					app.home.clickDisable = false;
					
					// set the question model
					app.question.set(message);
					
				}
				
				if ( message.sender == "updateScoreCard" ) {
					if ( app.getSession() == message.hashUid ) {
						
						app.scoreCard.set(message);
						
						// check if points are sent by the server correctly
						if ( message.points != undefined && message.rank != undefined ) {
							var data = {
								points: message.points,
								rank: message.rank,
								level: 1
							};
							
							// update the session data by new values given from the server & database
							app.setSessionData(data);
						}
						
						// check if flag is sent by the server correctly
						if ( message.correct != undefined ) {
							
							if ( message.correct == 1 ) {
								app.home.fastestSound();
							} else {
								app.home.incorrectSound();
							}
						}
					}
				}
				
			}
		});
	},
	
	// publish the message to the pubnub 
	pubnubPublish: function (qId,opt) {
		
		sessionData = app.getSessionData();
		var response = {
			userId: "anonymous",
			hashUid: this.getSession(),
			channel: this.channel,
			id: qId,
			sel_option: opt,
			sender: "user",
			
			points: sessionData.points,
			rank: sessionData.rank,
			level: sessionData.level
			
		};
		
		app.pubnub.publish({
			channel: this.channel,
			message:response,
			callback: function (m, e, c) {
				if (c && m) {
					console.log(JSON.stringify(c + ": " + m));
					// Only one argument
				} else if (m) {
					console.log(JSON.stringify(m));
				}
			},
			error: function (m, e, c) {
				if (c && m) {
					console.log(JSON.stringify(c + ": " + m));
					// Only one argument
				} else if (m) {
					console.log(JSON.stringify(m));
				}
			}
		});
	},
	
	getSession: function() {
		
		var session = "";
		if ( sessionStorage.getItem("userId") != null ) {
			session = sessionStorage.getItem("userId");
			
		} else {
			session = this.getRendom();
			sessionStorage.setItem("userId",session);
			
			// keep default values for points, rank and level
			sessionStorage.setItem("points",0);
			sessionStorage.setItem("rank",0);
			sessionStorage.setItem("level",1);
			
		}
		
		return session;
	},
	
	getSessionData: function () {
		// get session data
		var data = {
			points: sessionStorage.getItem("points"),
			rank: sessionStorage.getItem("rank"),
			level: sessionStorage.getItem("level")
		}
		return data;
	},
	
	setSessionData: function (data) {
		// set session data
		sessionStorage.setItem("points",data.points);
		sessionStorage.setItem("rank",data.rank);
		sessionStorage.setItem("level",data.level);
	},
	
	getRendom: function() {
		var hash = CryptoJS.MD5(Math.random().toString() + (new Date().getTime().toString()));
		return hash.toString(CryptoJS.enc.Hex);
	},
	
	// currentAudio Interval to end interval in case of user answers the question
	_audioInterval: null,
	
	playSpelling: function (url) {
		
		var audio = new Audio(url);
		audio.play();
		var count = 0;
		_app = this;
		_app._audioInterval = setInterval(function () {
			audio.play();
			if ( count == 1 ) {
				clearInterval(_app._audioInterval);
			}
			count++;
		},5000);
	},
	
	// currentCount Interval to end interval in case of user answers the question
	_countInterval: null,
	
	initCount: function () {
		
		count = app.defaultCount;
		_app = this;
		_app.home.$el.find("#countdown").val(count);
		_app._countInterval = setInterval(function () {
			_app.home.$el.find("#countdown").html(count--);
			if (count <= 0) {
				clearInterval(_app._countInterval);
			}
		},1000);
	},
	
	resetCount: function() {
		app.home.$el.find("#countdown").val(0);
		if ( app._countInterval != null ) {
			clearInterval(app._countInterval);
			app._countInterval = null;
		}
		
	},
	
	resetAudio: function() {
		if ( app._audioInterval != null ) {
			clearInterval(app._audioInterval);
			app._audioInterval = null;
		}
	}
	
}

$(function () {
	// Init every thing in this function
	app.init();
});

var AppRouter = Backbone.Router.extend({
	routes : {
		"" : "home",
		"home" : "home",
	},
	home : function() {
		app.home = new HomeView({ el: $("#home") });
	},
});
