var express = require('express');
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var favicon = require('serve-favicon');
var nunjucks = require('nunjucks');

var app = express();

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var appConfig = require('./config/appConfig');

// database
  var configDB = require('./config/database');
  mongoose.connect(configDB.url, function(err){
    if (err) {
      console.log(err);
    }
  });

// config
  app.set('view engine', 'html');
  app.set('views', __dirname + '/app/views');
  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  // app.use(express.static(__dirname + '/public'));
  app.use(session({ secret: appConfig.session }));
  require('./config/passport')(passport); // pass passport for configuration
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  app.use(favicon(__dirname + '/public/favicon.ico'));
  app.use('/public', express.static(__dirname + '/public'));
  app.use('/bower', express.static(__dirname + '/bower_components'));

  nunjucks.configure( __dirname + '/app/views', {
      autoescape: true,
      express: app
  });

app.get('/', function(req, res){
  res.render('index.html');
});

// Page routes
require('./app/routes/auth.js')(app, passport);

// REST routes
app.use('/', require('./app/routes/spot.js'));
app.use('/', require('./app/routes/user.js'));
app.use('/api', require('./app/routes/review.js'));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

  // development error handler; will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler; no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

if (!module.parent) {
  app.listen(port);
  console.log('Magic happens on port ' + port);
}
