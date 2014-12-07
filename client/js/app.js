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
	channel: "spell-survivor-level1",
	question: null,
	
	init: function () {
		app.router = new AppRouter();
		Backbone.history.start();
		this.question = new Question();
		
	//	this.pubnubInit();
	
	},
	
	pubnubInit: function (){
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
				
				if ( message.sender == "server" ) {
					
					// set current answer
					currentMessage = message;
					
					// first reset the counter
					app.resetCount();
					
					// set the question model
					app.question.set(message);
					
				}
				
			}
		});
	},
	
	pubnubPublish: function (qId,opt) {
		var response = {
			userId: "anonymous",
			hashUid: this.getSession(),
			channel: this.channel,
			id: qId,
			sel_option: opt,
			sender: "user"
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
		}
		
		return session;
	},
	
	getRendom: function() {
		var hash = CryptoJS.MD5(Math.random().toString() + (new Date().getTime().toString()));
		return hash.toString(CryptoJS.enc.Hex);
	},
	
	playSpelling: function (url) {
			
	},
	
	initCount: function () {
		count = app.defaultCount;
		
		app.home.$el.find("#countdown").val(count);
		var _interval = setInterval(function () {
			app.home.$el.find("#countdown").html(count--);
			if (count <= 0) {
				clearInterval(_interval);
			}
		},1000);
	},
	
	resetCount: function() {
		app.home.$el.find("#countdown").val(0);
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
