'use strict';
//var _ = require('lodash');
var express = require('express');
var Spot = require('../models/spot');
var Review = require('../models/review');
var mUtils = require('../models/model_utils');
var spotRouter = express.Router();


// spot.use(function(req, res, next){
//   console.log('There is middleware here');
//   next();
// });

// === VIEW ENDPOINTS === 
spotRouter.route('/feed')
  .get(function(req, res){
    res.render('feed');    
  });

spotRouter.route('/nearby')
  .get(function(req, res){
    res.render('nearby');
  });

// spotRouter.route('/geocode/:pos_latlng')
//   .get()

// TODO Might not want to expose the user id directly here
// could reredirect or somehow work around this
spotRouter.route('/spot/:spot_id')
  .get(function(req, res){
    res.render('spot');
  });

// === RESTFUL ENDPOINTS ===

spotRouter.route('/api/spots')
  .get(function(req, res){
    Spot.find(function(err, spots){
      res.json(spots);
    });
  })
  .post(function(req, res){
    var spot = new Spot();
    spot.name = req.body.name;
    spot.location.lat = req.body.lat;
    spot.location.lon = req.body.lon;

    spot.save(function(err){
      if(err){
        res.send(err);
      }
      res.json({ message: 'Spot created!' });
    });
  });

spotRouter.route('/api/spots/:spot_id')
  .get(function(req, res){
    // http://stackoverflow.com/questions/19222520/populate-nested-array-in-mongoose
    Spot.findOne({ _id: req.params.spot_id})
      .lean()
      .populate({ path: 'reviews' })
      .exec(function(err, docs) {

        var options = {
          path: 'reviews.author',
          model: 'User'
        };

        if (err) return res.json(500);
        Spot.populate(docs, options, function (err, reviews) {
          res.json(reviews);
        });
      });
  })
  .post(function(req, res){
    Spot.findById(req.params.spot_id, function(err, spot){
      if (err){
        res.send(err);
      }
      var review = new Review();
      review.spot = spot;
      review.author = req.user._id;
      review.body = req.body.body;
      if (req.params.rating) {
        review.rating.push(req.params.rating);
      }
      if (req.params.photo_url) {
        review.photos.push({
          url     : req.body.photo_url,
          caption : req.body.photo_caption
        });
      }
      review.save(function(err){
        if(err){
          res.send(err);
        }
        spot.reviews.push(review._id);
        spot.save(function(err){
          if(err){
            res.send(err);
          }
          res.json({ message: 'Review added!' });
        });
        
      });
      
      // spot.ratings.push('testing');

    });
  })
  .put(function(req, res){
    Spot.findById(req.params.spot_id, function(err, spot){
      if (err){
        res.send(err);
      }
      spot.name = req.body.name;
      spot.location.lat = req.body.lat;
      spot.location.lon = req.body.lon;

      spot.save(function(err){
        if(err){
          res.send(err);
        }
        res.json({ message: 'Spot updated!' });
      });
    });
  })
  .delete(function(req, res){
    Spot.remove({
      _id: req.params.spot_id
    }, function(err, spot){
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Successfully deleted' });
    });
  });

spotRouter.route('/api/nearby')
  .get(function(req, res){
    Spot.find({
      'location':
      { 
        $near: [ 37.760987, -122.433332 ]
        //, $maxDistance: '3'
      }
    })
    .limit(50)
    .exec(function(err, spots){
      if (err) {
        res.send(err);
      }
      res.json(spots);
    });
  });
// dev tool - population
  spotRouter.route('/test/populate')
    .get(function(req, res){

      Spot.find(function(err, spots){
        spots.forEach(function(v){
          v.remove();
        });
      });

      Review.find(function(err, reviews){
        reviews.forEach(function(v){
          v.remove();
        });
      });

      var spots = [
        [ "Ikes", 37.764384, -122.430587 ],
        [ "Magnolia", 37.758015, -122.387916 ],
        [ "Lous", 37.780544, -122.473230 ],
        [ "Philz", 37.760987, -122.433332 ]
      ];

      function makeSpot(name, lat, lng){
        var spot = new Spot();
        spot.name = name;
        spot.location = [lat, lng];
        spot.save(function(err){
          if(err) res.send(err);
        });
      }

      spots.forEach(function(v){
        makeSpot(v[0], v[1], v[2]);
      });


    res.redirect('/feed');
  });

  spotRouter.route('/test/popreviews')
    .get(function(req, res){
      var authors = [
        "53f4f5511ad6b75d771c2cf2", 
        '53f84c28cfe5e6a6bc0002ec', 
        '53f84c37cfe5e6a6bc0002f7', 
        "53f4f5511ad6b75d771c2cf2"];
      var bodies = ['Pizza', 'BBQ', 'Early Bird', 'Cheers!'];
      
      Spot.find(function(err, spots){
        
        spots.forEach(function(v, i){
          var review = new Review();
          review.spot = spots[i];
          review.author = authors[i];
          review.body = bodies[i];
          review.save();
          spots[i].ratings.push(4);
          spots[i].reviews.push(review._id);
          spots[i].save();
        });

        var review = new Review();
        review.spot = spots[1];
        review.author = authors[3];
        review.body = bodies[3];
        review.save();
        spots[1].ratings.push(5);
        spots[1].reviews.push(review._id);
        spots[1].save();

      });      

      res.redirect('/feed');
    });
//deprecating
//spotRouter.route('/api/spots/:spot_id/reviews')

// might move to reviews
// spotRouter.route('/api/feed')
//   .get(function(req, res){
//     Spot
//       .find()
//       .limit(100)
//       .populate('reviews')
//       .sort('created')
//       //.select('name reviews created')
//       .exec(function(err, spots){
//         if (err) {
//           res.send(err);
//         }
//         res.send(spots);
//       });
//   });

module.exports = spotRouter;