'use strict';
var mongoose = require('mongoose');
var saveDate = require('./model_utils').saveDate;

// define the schema for our user model
var spotSchema = mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  profileImg: String,
  address: String, 
  phone: String,
  email: String,
  type: String,
  location: {
    type: [Number],
    index: '2d',
  },
  reviews: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Review'
  }],
  ratings: [ Number ],
  average: [],
  created: Date,
  updated: Date
});


spotSchema.pre('save', function(next){

  // calculate `average`
  this.average = this.ratings.reduce(function(acc, val){
    return acc + val;
  }, 0) / this.ratings.length;

  // initiate `created` and update `updated`
  saveDate.call(this, next);
});

module.exports = mongoose.model('Spot', spotSchema);
