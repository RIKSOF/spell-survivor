
var RS_PUBNUB = null;
var CURRENT_CHANNEL = null;
var CHANNEL_NAME = 'spell-survivor-level1';
var MAX_SCORE = 100;
var QUESTION_POST_MAX_TIME = 15000; // In milli second
var SCORE_DEDUCT_PER_SECOND = 2;
var questionPostTimeStamp = 0;
var currentQuestionId = null;
var questionToPost = null;
var serverFirstRun = false;
var channels = new Array();
var scores = new Array();
var answerList = [];
var serverStarted = false;

var questionController = require( __dirname + '/question');
var userController = require( __dirname + '/user');

/**
 * Setup pubnub
 **/
exports.setupPubnub = function() {
    console.log('setupPubnub');
    RS_PUBNUB = require("pubnub")({
        ssl           : false,  // <- enable TLS Tunneling over TCP
        publish_key   : "demo",
        subscribe_key : "demo"
    });

};

/**
 * Subscribe to a channel on pubnub
 **/
exports.subscribePubnub=function(channel) {

    if ( RS_PUBNUB != null ) {
        RS_PUBNUB.subscribe({
                channel  : channel,
                message : messageOnChannel,
                error: errorOnSubscribeChannel
            });
    } else {
        callback('RS_PUBNUB is null inside subscribePubnub');
    }

};

/**
 * Unsubscribe channel on pubnub
 **/
exports.unsubscribePubnub= function(channel) {
    if ( RS_PUBNUB != null ) {

        RS_PUBNUB.unsubscribe({ 
            channel: channel,
            callback: displayCallback,
            error: displayCallback
        });
    } else {

        callback('RS_PUBNUB is null inside publishPubnub');
    }
};

/**
 * Publish message on pubnub
 **/
exports.publishPubnub= function(channel, message) {
    if ( RS_PUBNUB != null ) {

        answerList[ message.id ] = message.a ;
        currentQuestionId = message.id;

        delete message.a;

        RS_PUBNUB.publish({ 
            channel   : channel,
            message   : message,
            callback  : displayCallback,
            error     : displayCallback
        });

    
        

        // question is posted, now set null to questionToPost            
        questionToPost = null;

        // ask for another question
        questionController.getQuestion(4, getQuestionCallback);

    } else {

        displayCallback('RS_PUBNUB is null inside publishPubnub');
    }
};

function displayCallback(m, e, c) {
    // Use first and last args

    console.log({callBackFor:"displayCallback line:60", m:m, e:e, c:c});
}

function displayCallback(callBackFor, m, e, c) {
    // Use first and last args

    console.log({callBackFor:callBackFor, m:m, e:e, c:c});
}


/*
W
*/
function messageOnChannel(m, e, c) {

    console.log('messageOnChannel');
    console.log('Channel name: ' + c);

    if ( m ) {
        
        if ( m.sender == "user" ) {  
            

            // if user reply on current question
            if ( m.id == currentQuestionId ) {
                
                console.log( "Message/Reply from user " + JSON.stringify(m) );
    
                // if answer is correct [Reply to all about some one answered with userId(who have answered)].
                if ( m.sel_option == answerList[currentQuestionId] ) {

					console.log( "in pubnub line 133 - Correct answer was received");
					
                    // time difference b/w question post from server, and user reply    
                    var diff = ( ( new Date().getTime() ) - questionPostTimeStamp ) /1000;
                    // calculate points
                    m.points = Math.round( MAX_SCORE -  (diff * SCORE_DEDUCT_PER_SECOND) );

					/*
                    console.log( { 
						diff: diff,
						SCORE_DEDUCT_PER_SECOND : SCORE_DEDUCT_PER_SECOND,
						Poinst : points,
						Answer : answerList[currentQuestionId] 
					} );
					*/
					
                    // remove answer from list
                    delete answerList[currentQuestionId];
					
                   // m.channel   =   channel;

					//When we recived a correct answer, broadcast to all we have received a correct answer,
					//Update the score card of the user where the {hashUid: m.hashUid, userId: m.userId} are matched
					userController.saveScore( m, function( src ){
						
						if ( RS_PUBNUB != null ) {
                           
                            console.log(  "update score card of the user : ", src );
					        RS_PUBNUB.publish({ 
					            channel   : src.channel,
					            message   : src,
					            callback  : displayCallback,
					            error     : displayCallback
					        });
					    } else {
                            console.log('RS_PUBNUB is null at 167');
                        }
					});
                }
				// else answer is wrong/correct but late [Reply to all about some one answered with userId(who have answered)].
				else{
					//for safe side
					m.points	=	(m.points == undefined ) ? 0 : m.points;
					m.level		=	(m.level == undefined ) ? 0 : m.level;
					m.channel	=	(m.channel == undefined ) ? CHANNEL_NAME : m.channel;
					m.hashId	=	(m.hashId == undefined ) ? 0 : m.hashId;
					m.userId	=	(m.userId == undefined ) ? 0 : m.userId;
					
					var doc = {};
					//Vars required When user select the option[ for new user send the default values ]
					doc.points	= m.points;
					doc.level	= secrets.levels[m.channel];
					doc.rank	= 1; 
					doc.hashId	= m.hashId;
					doc.userId	= m.userId;		  		  

					//server can create these vars if not found
					doc.lastUpdated = ""+ new Date();
					
					
					channel	=	m.channel;

					if ( RS_PUBNUB != null ) {
					    RS_PUBNUB.publish({ 
					        channel   : channel,
					        message   : doc
					    });
					}
				}
            }

        } 
        else if ( m.sender == "updateScoreCard" ) {  
            console.log( "updateScoreCard " + JSON.stringify(m) );
        }        
        else if ( m.sender == "server" ) {  
           
            // set question posting timestamp
            questionPostTimeStamp = new Date().getTime();
            // set current question id
            

            console.log( "Message from server " + JSON.stringify(m) );
            console.log( "At timestamp" + questionPostTimeStamp );
            console.log ("At time: " + (new Date(questionPostTimeStamp)) );
            //console.log("currentQuestionId: " + currentQuestionId);
            //console.log('answerList : ' + answerList[currentQuestionId]);
            
        }
    }

    // Use first and last args
    //console.log({callBackFor:"messageOnChannel line:71", m:m, e:e, c:c});
}

function errorOnSubscribeChannel(m, e, c) {
     console.log({callBackFor:"errorOnSubscribeChannel line:75", m:m, e:e, c:c});
};


//Functions executions

exports.setupPubnub();
exports.subscribePubnub( CHANNEL_NAME );

// this functon will call once server get started
setInterval( function() {

    if ( questionToPost == null ) {
        questionController.getQuestion(4, getQuestionCallback);
    } else {
        exports.publishPubnub( CHANNEL_NAME, questionToPost );
    }
   
}, QUESTION_POST_MAX_TIME );

/**
 * Question callback
 * This function will process question data
 **/
function getQuestionCallback(question) {

    questionToPost = question;
}


