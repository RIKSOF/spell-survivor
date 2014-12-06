
var RS_PUBNUB = null;

exports.setupPubnub = function() {
    console.log('setup');
    RS_PUBNUB = require("pubnub")({
        ssl           : false,  // <- enable TLS Tunneling over TCP
        publish_key   : "demo",
        subscribe_key : "demo"
    });

};

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

exports.publishPubnub= function(channel, message) {
    if ( RS_PUBNUB != null ) {

        RS_PUBNUB.publish({ 
            channel   : channel,
            message   : message,
            callback  : displayCallback,
            error     : displayCallback
        });
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
    // Use first and last args
    console.log({callBackFor:"messageOnChannel line:71", m:m, e:e, c:c});
}

function errorOnSubscribeChannel(m, e, c) {
     console.log({callBackFor:"errorOnSubscribeChannel line:75", m:m, e:e, c:c});
};




//Functions executions

exports.setupPubnub();
exports.subscribePubnub('myfirstgame');

function getUniqueId(){
    return ( new Date().getTime()+"-"+Math.random(0,100) );
}

var questionAry = [
 { "id":getUniqueId(), "q":"Apple", "options":["Aple", "Aaple", "Apele", "Apple"]}
,{ "id":getUniqueId(), "q":"Ball", "options":["Boll", "Balle", "Ball", "Bale"]}
,{ "id":getUniqueId(), "q":"Cat", "options":["Cet", "Kat", "Cte", "Cat"]}
,{ "id":getUniqueId(), "q":"Doll", "options":["Dole", "Dule", "Doll", "Dolle"]}
];



/*setInterval( function() {
    exports.publishPubnub('myfirstgame', questionAry[Math.floor(Math.random() * 4)] );
}, 5000 );
*/

