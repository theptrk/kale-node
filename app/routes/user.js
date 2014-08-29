var express = require('express');
var User = require('../models/user');
var Review = require('../models/review');
var userRouter = express.Router();

// === VIEW ENDPOINTS ===
userRouter.route('/user/:user_id')
  .get(function(req, res){
    res.render('user');
  });


// === RESTFUL ENDPOINTS ===
userRouter.route('/api/user/:user_id')
  .get(function(req, res){
    User.findById(req.params.user_id, function(err, user){
      if (err) {
        res.send(err);
      }
      res.json(user);
    });
  });

userRouter.route('/api/user/:user_id/reviews')
  .get(function(req, res){
    User.findById(req.params.user_id, function(err, user){
      if (err) {
        res.send(err);
      }
      Review
        .find({ author: req.params.user_id })
        .sort('-created')
        .populate('spot')
        .exec(function(err, reviews){
          if(err){
            res.send(err);
          }
          res.json(reviews);
        });
    });
  });

module.exports = userRouter;