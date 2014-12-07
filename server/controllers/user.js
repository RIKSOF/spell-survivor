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
 * Post answer
 **/
exports.postAnswer = function(hashId, channel,answer) {


        User.find({
            hashId: hashId
        }, function(err, u) {

            if (err) {
                console.log(JSON.stringify(err));
            }

            // users found
            if (u.length > 0) {

                // update details
                Score.update({
                            "userId":hashId,
                            "channel": channel
                        }, { $push: {answers: answer } }, 
                        {
                            safe: true, upsert: true
                        },
                        function(err, model) {

                            if (err) {
                                console.log(JSON.stringify(err));
                            }

                            console.log('answer added successfully.');
                        });
               

            } else {

                console.log('no user found for this username: ' + hashId);

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

            var points = 0;

            if( score.answer.length > 0 ) {
                points += Number(answer.points);
            }
               
     });

};


