var request = require('request');
/**
 *
 * get random words
 *
**/
exports.getWords= function(req, res) {
  
};


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