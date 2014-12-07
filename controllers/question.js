var request = require('request');

/**
* Conver text into audio.
* @word: String < Apple >
* @callBack: function //Example result: { err: null,  body: 'http://media.tts-api.com/d0be2dc421be4fcd0172e5afceea3970e2f3d940.mp3' }
*/
exports.getAudioUrl = function(word, callBack) {
	var reqUrl = 'http://tts-api.com/tts.mp3?return_url=1&q='+word ;	
	//console.log("In getAudioUrl reqUrl = "+reqUrl);
	
    request.get(reqUrl, function(err, request, body) {
		callBack( {err:err, body:body} );
    });
};

/* //Testing code for wordstring into audio url
exports.getAudioUrl("Apple",function( resultObj ){
	console.log( resultObj );
});
*/

/**
* Get question
* @param: Integer, difficultyLevel
* @callBack: function //Example result: { err: null,  body: 'http://media.tts-api.com/d0be2dc421be4fcd0172e5afceea3970e2f3d940.mp3' }
*/
exports.getQuestion = function(difficultyLevel, callBack) {
    console.log('getQuestion');
    // query to sql, to get word,
    // get audio for this word
    
    // response to request
    question = questionAry[Math.floor(Math.random() * 4)];
    question['audioUrl'] = "http://media.tts-api.com/d0be2dc421be4fcd0172e5afceea3970e2f3d940.mp3";
    
    // execute callback
	callBack({question:question});
};


function getUniqueId(){
    return ( new Date().getTime() + Math.random(0,100) );
}

var questionAry = [
 { "id":getUniqueId(), "q":"Apple", "options":["Aple", "Aaple", "Apele", "Apple"], sender:"server"}
,{ "id":getUniqueId(), "q":"Ball", "options":["Boll", "Balle", "Ball", "Bale"], sender:"server"}
,{ "id":getUniqueId(), "q":"Cat", "options":["Cet", "Kat", "Cte", "Cat"], sender:"server"}
,{ "id":getUniqueId(), "q":"Doll", "options":["Dole", "Dule", "Doll", "Dolle"], sender:"server"}
];



