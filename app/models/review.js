'use strict';
var mongoose = require('mongoose');
var saveDate = require('./model_utils').saveDate;

var reviewSchema = mongoose.Schema({
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
  created: {type: Date, index: true },
  updated: Date
});

reviewSchema.pre('save', function(next){
  saveDate.call(this, next);
});

module.exports = mongoose.model('Review', reviewSchema);
