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

function processWords ( start, limit ) {
    console.log('Processing - start: ' + start + ' limit: ' + limit );
    
    mysqlClient.query('SELECT id, word from words limit ' + start + ', ' + limit, function(err, rows, fields) {
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
          var index = i;
        
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
        
          // This ensures values for each callback are maintained correctly.
          (function( lvl, wrd, wrdId, idx ){
        
              mysqlClient.query('SELECT word from words WHERE word SOUNDS LIKE "' + wrd + '" LIMIT 4', function(err2, rowOfSimilarWords, fields2) {
                  if (err) throw err;
            
                  var options = [];
                  for ( var j = 1; j < rowOfSimilarWords.length; j++ ) {
                      options[j-1] = rowOfSimilarWords[j].word;
                  }
                
                  // If the number of options is less, just take the next coming words
                  var k = idx + 1;
                  if ( k > rows.length - 3 ) {
                      k = idx - 5;
                  }
                  
                  for ( j = options.length; j < 3; j++, i++ ) {
                      options[j] = rows[k].word;
                  }
            
                  // Confusing words
                  for ( var key in confusingSpellings ) {
                      if ( wrd.indexOf( key ) >= 0 ) {
                          options[2] = wrd.replace( key, confusingSpellings[key] );
                          break;
                      }
                  }
            
                  // Update the level and option words
                  mysqlClient.query('UPDATE words SET level=' + lvl + ', option_1="' + options[0] + '", option_2="' + options[1] + '", option_3="' + options[2] + '" where id = ' + wrdId +';', function(){
                      // If this is the last one
                      if ( idx == rows.length - 1 ) {
                          // Do next batch
                          processWords( start + limit, limit );
                      }
                      
                  });
              });
        
          })(level, word, wordId, index);
      }
    
    });
}

mysqlClient.connect( function ( err ) {
  if ( err )  {
      console.log('Mysqlconnection error: '+err);
  } else {
      console.log("Mysql connected succesfully.");
  }
  
  processWords( 0, 10 );
});