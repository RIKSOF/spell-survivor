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
exports.saveScore = function( m ) {

	var query = {};
	if( m.userId != "anonymous" ){
		query	= { hashId: m.hashId };
	}else{
		query	= { userId: m.userId };
	}
	
	Score.findOne(query, function (err, doc){
        if (err) {
            console.log(JSON.stringify(err));
			return;
        }else{
		  doc.points	= (doc.points == undefined ) ? m.points ? ( doc.points+ m.points) ; 
		  doc.level		= secrets.levels[m.channel];
		  doc.rank		= 1;
		  doc.lastUpdated = ""+ new Date();
	  	  doc.save();
        }
	});
};

/**
 * Get user current score
 *
**/
exports.getCurrentScore = function(hashId, channel,callback) {

     Score.find({
            hashId: hashId,
            channel:channel
        }, function(err, score) {

          if (err) {
              console.log(JSON.stringify(err));
              return;
          }
		  else {
	  		  doc.points	= (doc.points == undefined ) ? m.points ? ( doc.points+ m.points) ; 
	  		  doc.level		= secrets.levels[m.channel];
	  		  doc.rank		= 1;
	  		  doc.lastUpdated = ""+ new Date();
	  	  	  doc.save();
	  		  /*
	  		  doc.maxScore  = secrets.levels[m.channel].maxScore;		  
	  		  doc.isLevelUpdated = false;		  
	  		  if( secrets.levels[m.channel].maxScore > doc.points  ) {
	  			  doc.isLevelUpdated = true;
	  		  }
	  		  */
	  	  }
               
     });

};


