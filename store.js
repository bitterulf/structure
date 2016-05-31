const util = require('util');
const EventEmitter = require('events');
const Datastore = require('nedb');

function Store() {
  EventEmitter.call(this);
  this.db = new Datastore();
};

util.inherits(Store, EventEmitter);

Store.prototype.insert = function(doc, cb) {
  const db = this.db;
  this.db.insert(doc, function() {
    db.find({}, cb);
  });
};

Store.prototype.find = function() {
  this.db.find.apply(this, arguments);
};

module.exports = Store;
