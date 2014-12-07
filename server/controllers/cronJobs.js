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
exports.c1SetLevel = function(req, res, next) {
	
	
  
};