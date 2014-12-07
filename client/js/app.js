// JavaScript Document

var app = {
	
	// views
	home: null,
	
	// pubnub
	pubnub: null,
	
	// router
	router: null,
	
	// pubnub creds
	publishKey: 'demo',
	subscribeKey: 'demo',
	channel: "spell-survivor",
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
				console.log(message);
				if ( message.sender == "server" ) {
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