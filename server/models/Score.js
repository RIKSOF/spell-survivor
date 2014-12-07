var mongoose = require('mongoose');
var scoreSchema = new mongoose.Schema({

 userId:String,
 channel:String,
 points:Number,
 level:Number,
 rank:Number,
 lastUpdated: String
});

module.exports = mongoose.model('Score', scoreSchema);

