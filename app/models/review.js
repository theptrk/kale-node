'use strict';
var mongoose = require('mongoose');
var saveDate = require('./model_utils').saveDate;

var reviewSchema = mongoose.Schema({
  // author: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User'
  // },      
  spot: {
    type: mongoose.Schema.ObjectId,
    ref: 'Spot'
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }, 
  body: String,
  photos: [{ url: String, caption: String }],
  created: Date,
  updated: Date
});

reviewSchema.pre('save', function(next){
  saveDate.call(this, next);
});

module.exports = mongoose.model('Review', reviewSchema);