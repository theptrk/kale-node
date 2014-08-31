'use strict';

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = new mongoose.Schema({
    name: String,
    displayName: String,
    local            : {
        email        : String,
        password     : String,
    },

    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
        photos       : String,
        gender       : String
    },

    created: Date,
    updated: Date
});

// methods ===
// generating a hash
userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.pre('save', function(next){
  var now = new Date();
  this.updated = now;
  if ( !this.created ) {
    this.created = now;
  }
  next();
});
// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
