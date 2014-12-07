var request = require('request');
var secrets = require('../config/secrets');
/**
* Conver text into audio.
* @word: String < Apple >
* @callBack: function //Example result: { err: null,  body: 'http://media.tts-api.com/d0be2dc421be4fcd0172e5afceea3970e2f3d940.mp3' }
*/
exports.getAudioUrl = function(question, callBack) {

	var reqUrl = 'http://tts-api.com/tts.mp3?return_url=1&q=' + question.a ;	
	
    request.get(reqUrl, function(err, request, body) {
        question['audioUrl'] = body;
		callBack( question );
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

    if ( secrets.mysqlConnection ) {
        var r1= parseInt( Math.random()*( Math.random()*99999) );
        
        var queryString = "Select * from words Limit "+r1+", 4"
        //console.log(queryString);

        secrets.mysqlConnection.query(queryString, function(err, rows, fields) {
            if (err) { 
                console.log(err);
            }
 
            var ques1 = [];
            var options = [];

            for (var i in rows) {
                options.push(rows[i].word);
               
            }
                                                //options[getRendom(0,3)]
            ques1   =    { "id":getUniqueId(), "a":options[0], "options":options, sender:"server"};
            exports.getAudioUrl(ques1, callBack);

            //console.log(ques1);
        });
    } else {
        console.log('No MYSQL CONNECTION');
    }

    
    // query to sql, to get word,
    // get audio for this word
    
    // response to request
    //question = questionAry[Math.floor(Math.random() * 4)];
    //question['audioUrl'] = "http://media.tts-api.com/d0be2dc421be4fcd0172e5afceea3970e2f3d940.mp3";
    
    // execute callback
	//callBack({question:question});
};


function getRendom(str,end){
    return Math.floor(Math.random() * 4);
}
function getUniqueId(){
    return ( "u"+new Date().getTime() + Math.random(0,100) ).substr(0,10);
}

var questionAry = [
 { "id":getUniqueId(), "q":"Apple", "options":["Aple", "Aaple", "Apele", "Apple"], sender:"server"}
,{ "id":getUniqueId(), "q":"Ball", "options":["Boll", "Balle", "Ball", "Bale"], sender:"server"}
,{ "id":getUniqueId(), "q":"Cat", "options":["Cet", "Kat", "Cte", "Cat"], sender:"server"}
,{ "id":getUniqueId(), "q":"Doll", "options":["Dole", "Dule", "Doll", "Dolle"], sender:"server"}
];



