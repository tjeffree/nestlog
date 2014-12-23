// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    nest           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

userSchema.index( { "google.id": 1 }, { unique: true } );

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);

/*
module.exports.remove({}, function(err) {
    console.log('DEBUG: CLEARED USER COLLECTION');
});
*/
