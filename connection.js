const util = require('util');
const EventEmitter = require('events');

function Connection(id) {
  EventEmitter.call(this);
  this.id = id;
  this.cache = {};
};

util.inherits(Connection, EventEmitter);

Connection.prototype.update = function(key, data) {
  this.cache[key] = data;
  this.emit('clientUpdate', this.cache);
};

module.exports = Connection;
