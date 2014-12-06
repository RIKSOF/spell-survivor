// JavaScript Document

var app = {
	
	// views
	home: null,
	
	// router
	router: null,
	
	init: function () {
		app.router = new AppRouter();
		Backbone.history.start();
	
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
		app.home.render();
	},
});