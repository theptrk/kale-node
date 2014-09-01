var express = require('express');
var Review = require('../models/review');
var reviewRouter = express.Router();

// === RESTFUL ENDPOINTS ===
reviewRouter.route('/reviews')
  .get(function(req, res){
    Review.find(function(err, reviews){
      if(err) res.send(err);
      res.json(reviews);
    });
  });

reviewRouter.route('/feed/')
  .get(function(req, res){
    Review
    .find()
    .limit(100)
    .sort('-created')
    .populate('spot')
    .populate('author')
    .exec(function(err, reviews){
      if (err) {
        res.send(err);
      }
      res.json(reviews);
    });
  });

reviewRouter.route('/feed/:limit/:date')
  .get(function(req, res){
    Review
    .find({ created: { $lt: req.params.date }})
    .sort({ created: -1 })
    .limit(20)
    .exec(function(err, reviews){
      if (err) { res.send(err); }
      res.json(reviews);
    });
  });

module.exports = reviewRouter;