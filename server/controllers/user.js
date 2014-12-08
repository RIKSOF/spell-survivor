var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');
var Score = require('../models/Score');
var secrets = require('../config/secrets');

/**
 *
 * Create
 **/
exports.createUser = function(hashId, channel) {

    var user = new User();
    user.hashId = hashId;
    user.save(function(err, usr) {

        // If there was an error saving user
        if (err) {
            console.log(JSON.stringify(err));      
        } else {
            console.log('User Saved');
            /*var score = new Score();
            score.userId = hashId;
            score.channel = channel;
            
            score.save(function(err, scr) {

                // If there was an error saving score
                if (err) {
                    console.log(JSON.stringify(err)); 
                } else {
                    console.log('Score Saved');    
                }

            });*/// end of score saving
        }

    }); // end of user save

};

/**
 *
 * Save answer in database
 **/
exports.saveScore = function( m, callback ) {

	console.log( {msg:"in saveScore fn ", m:m } );

	var query = { hashId: m.hashId, userId: m.userId };
	
	Score.findOne(query, function (err, doc){
        if (err) {
			console.log( {msg:"error in save ", err:JSON.stringify(err) } );
			return;
        }else{
		  //Vars required When user select the option[ for new user send the default values ]
		  doc.points	= (doc.points == undefined ) ? m.points : ( doc.points+ m.points) ; 
		  doc.level		= secrets.levels[m.channel];
		  doc.rank		= 1; 
		  doc.hashId	= m.hashId;
		  doc.userId	= m.userId;		  		  
		  
		  //server can create these vars if not found
  		  doc.lastUpdated = ""+ new Date();
	  	  doc.save();
		  
		  callback( doc );
        }
	});
};

/**
 * Get user current score
 *
**/
exports.getCurrentScore = function(req, res, next) {
	res.jsonp({points:1,level:1,rank:1});
/*
	var hashId	=	req.query.hashId;
	var userId	=	req.query.userId;


	var query = {};
	if( userId != "anonymous" ){
		query	= { hashId: hashId };
	}else{
		query	= { userId: userId };
	}
	
	Score.findOne(query, function (err, doc){
		var ret = {};
        if ( err ) {
            ret.err = JSON.stringify(err));

        } else {
		  doc.points	= (doc.points == undefined ) ? m.points ? ( doc.points+ m.points) ; 
		  doc.level		= secrets.levels[m.channel];
		  doc.rank		= 1;
		  doc.lastUpdated = ""+ new Date();
	  	  doc.save();
        }
	});
	*/
};


