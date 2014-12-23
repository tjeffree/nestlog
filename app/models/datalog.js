// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var datalogSchema = mongoose.Schema({
    userid      : String,
    t           : { type: Date, default: Date.now },
    temp        : Number,
    humidity    : Number,
    target      : Number

});

datalogSchema.index({ userid: 1, t: 1 });

datalogSchema.index({ t: 1 }, { expiresAfterSeconds: 864000 });

// create the model for users and expose it to our app
module.exports = mongoose.model('Datalog', datalogSchema);

/*
module.exports.remove({}, function(err) {
    console.log('DEBUG: CLEARED DATALOG COLLECTION');
});
*/
