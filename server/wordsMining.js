/**
 *
 * Cronjob1 Set Leve
	1 - Here we fetch all words
	2 - Create 4 similler word 
	3 - Find the difficulty of word
	Store this info in database.
	|	id	 | word		|
	---------------------
	|	4827 | apple	|

	After Execution

	|	id	 |	word	|	level	|	option1	|	option2	|	option3	|	option4	|
	---------------------------------------------------------------------------------
	|	4827 | apple 	|	appal	|	appol	|	appl	|	apple	|	appli	|

	Note: Options also have a correct option for user, 
		  keep word on server side, compare it with user selected option and award the points. 
 *
 *
**/
var mysql = require('mysql');
var secrets = require('./config/secrets');

var mysqlClient = mysql.createConnection(secrets.config.mysql);

mysqlClient.connect( function ( err ) {
  if ( err )  {
      console.log('Mysqlconnection error: '+err);
  } else {
      console.log("Mysql connected succesfully.");
  }
  
  mysqlClient.query('SELECT id, word from words', function(err, rows, fields) {
    if (err) throw err;
    
    // Array of tricky words
    var trickyWords = [
        'able', 'ible',
        'ly', 'cc', 'ss',
        'cq', 'ie', 'ei',
        'mm', 'nn', 'ery',
        'ary', 'sc', 'ti',
        'cede', 'er', 're',
        'ign', 'au', 'ate',
        'eat', 'ous', 'os',
        'euver', 'oeuvre',
        'wright', 'right'
    ];
    
    // Confusing spellings
    var confusingSpellings = {
        'able': 'ible',
        'ible': 'able',
        'aly': 'ly',
        'ly': 'aly',
        'cc': 'c',
        'ss': 's',
        'ie': 'ei',
        'ei': 'ie',
        'mm': 'm',
        'nn': 'n',
        'ery': 'ary',
        'ary': 'ery',
        'sc': 'ti',
        'ti': 'sc',
        'cede': 'ceed',
        'ceed': 'cede',
        'er': 're',
        'ign': 'ing',
        'ate': 'eat',
        'eat': 'ate',
        'ous': 'os',
        'os': 'ous',
        'euver': 'oeuvre',
        'oeuvre': 'euver',
        'wright': 'right',
        'right': 'wright' 
    }
    
    tLen = trickyWords.length;

    for( var i = 0, len = rows.length; i < len; i++  ) {
        var level = 1;
        var word = rows[i].word;
        var wordId = rows[i].id;
        
        // Length factor on level.
        if ( word.length > 7 ) {
            level += 3;
        } else if ( word.length > 5 ) {
            level += 2;
        } else if ( word.length > 3 ) {
            level += 1;
        }
        
        // Tricky words
        for ( var j = 0; j < tLen; j++ ) {
            if ( word.indexOf( trickyWords[j] ) >= 0 ) {
                level++;
            }
        }
        
        //Make a query with sounrd like for the word, if the count of such rows is more than 4, level++, if it is more than 6, level+2 and if it is more than 8, level +3
        
        mysqlClient.query('SELECT word from words WHERE word SOUNDS LIKE "' + word + '" LIMIT 3', function(err2, rowOfSimilarWords, fields2) {
            if (err) throw err;
            
            var options = [];
            for ( var j = 0; j < rowOfSimilarWords.length; j++ ) {
                options[j] = rowOfSimilarWords[j].word;
            }
            
            
            // Confusing words
            for ( var key in confusingSpellings ) {
                if ( word.indexOf( key ) >= 0 ) {
                    options[2] = word.replace( key, confusingSpellings[key] );
                    break;
                }
            }
            
            // Update the level and option words
            mysqlClient.query('UPDATE words SET level=' + level + ', option_1="' + options[0] + '", option_2="' + options[1] + '", option_3="' + options[2] + '" where id = ' + wordId +';', function(){
                console.log('updated');
            });
        
        });
    }
    
  });
});