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
  this.db.insert(doc, function(err, newDoc) {
    if (cb) cb(err, newDoc);
    that.db.find({}, function(err, docs) {
      that.emit('change', that.name, docs);
    });
  });
};

Store.prototype.find = function() {
  this.db.find.apply(this.db, arguments);
};

Store.prototype.remove = function(query, config, cb) {
  const that = this;
  this.db.remove(query, config, function(err, numRemoved) {
    if (cb) cb(err, numRemoved);
    that.db.find({}, function(err, docs) {
      that.emit('change', that.name, docs);
    });
  });
};

module.exports = Store;
