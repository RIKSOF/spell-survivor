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
    
    tLen = trickyWords.length;

    for( var i = 0, len = rows.length; i < len; i++  ) {
        var level = 1;
        var word = rows[i].word;
        
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
        
        // Update the level
        mysqlClient.query('UPDATE words SET level = ' + level + ' where id = ' + rows[i].id +';');

        console.log('The solution is: ', rows[i].id + ': ' + rows[i].word + ' (' + level + ')');
    }
    
    mysqlClient.end();
  });
});