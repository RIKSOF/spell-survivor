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

        // get row count for this difficulty level
        var queryString1 = "Select COUNT(*) as rowCount from words where level = " + difficultyLevel;

        secrets.mysqlConnection.query(queryString1, function(err, rows, fields) {
            if (err) { 
                console.log(err);
            }
            
            for (var i in rows) {
                var count = rows[i].rowCount;
            }
           
            var r1= parseInt( Math.random()*( Math.random()*count) );
          
            var queryString2 = "Select * from words where level =" + difficultyLevel + " Limit "+r1+", 1";
            
            secrets.mysqlConnection.query(queryString2, function(err, rows, fields) {
                if (err) { 
                    console.log(err);
                }
     
                var ques1 = [];
                var options = [];

                for (var i in rows) {
                    options.push(rows[i].word);
                    options.push(rows[i].option_1);
                    options.push(rows[i].option_2);
                    options.push(rows[i].option_3);
                }

                ques1   =    { "id":getUniqueId(), "a":options[getRendom(0,3)], "options":options, sender:"server"};
                exports.getAudioUrl(ques1, callBack);
            });
                                             
           
        });

    } else {
        console.log('No MYSQL CONNECTION');
    }

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



