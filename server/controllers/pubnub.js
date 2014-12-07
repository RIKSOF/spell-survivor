
var RS_PUBNUB = null;
var CURRENT_CHANNEL = null;
var CHANNEL_NAME = 'spell-survivor';
var MAX_SCORE = 100;
var QUESTION_POST_MAX_TIME = 15000; // In milli second
var SCORE_DEDUCT_PER_SECOND = 2;
var questionPostTimeStamp = 0;
var currentQuestionId = null;
var questionToPost = null;
var serverFirstRun = false;
var channels = new Array();
var scores = new Array();

var questionController = require( __dirname + '/question');

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

function messageOnChannel(m, e, c) {

    console.log('messageOnChannel');
    console.log('Channel name: ' + c);

    if ( m ) {
        
        if ( m.sender == "user" ) {  
            
            // if user reply on current question
            if ( m.id == currentQuestionId ) {
                
                conosle.log( "Message/Reply from user " + JSON.stringify(m) );
    
                // time difference b/w question post from server, and user reply    
                var diff = questionPostTimeStamp - new Date().getTime();
                // calculate points
                var points = MAX_SCORE -  (diff * SCORE_DEDUCT_PER_SECOND);

                console.log('Poinst : ' + points);
                
            }

        } else {
            
            // set question posting timestamp
            questionPostTimeStamp = new Date().getTime();
            // set current question id
            currentQuestionId = m.id;

            console.log( "Message from server " + JSON.stringify(m) );
            console.log( "At timestamp" + questionPostTimeStamp );
            console.log ("At time " + (new Date(questionPostTimeStamp)) );
            
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

