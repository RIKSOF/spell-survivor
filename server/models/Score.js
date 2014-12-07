var mongoose = require('mongoose');
var scoreSchema = new mongoose.Schema({

 userId:String,
 channel:String,
 answers:[]
});

module.exports = mongoose.model('Score', scoreSchema);

