const util = require('util');
const EventEmitter = require('events');

function Connection(id) {
  EventEmitter.call(this);
  this.id = id;
};

util.inherits(Connection, EventEmitter);

Connection.prototype.update = function(key, data) {
  this.emit('clientUpdate', key, data);
};

module.exports = Connection;
