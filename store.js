const util = require('util');
const EventEmitter = require('events');
const Datastore = require('nedb');

function Store(name) {
  EventEmitter.call(this);
  this.db = new Datastore();
  this.name = name;
};

util.inherits(Store, EventEmitter);

Store.prototype.insert = function(doc, cb) {
  const that = this;
  this.db.insert(doc, function() {
    that.db.find({}, function(err, docs) {
      that.emit('change', that.name, docs);
    });
  });
};

Store.prototype.find = function() {
  this.db.find.apply(this, arguments);
};

module.exports = Store;
