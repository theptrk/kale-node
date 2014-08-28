var saveDate = function(next) {
  var now = new Date();
  this.updated = now;
  if ( !this.created ) {
    this.created = now;
  }
  next();
};

var ifErr = function(err){
  if(err) { res.send(err); }
};

module.exports.saveDate = saveDate;
