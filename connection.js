const util = require('util');
const EventEmitter = require('events');

function Connection(id) {
  EventEmitter.call(this);
  this.id = id;
};

util.inherits(Connection, EventEmitter);

Connection.prototype.auth = function(username, password) {
  console.log('auth', username, password);
  this.emit('token', username+'-'+password);
  this.emit('ready');
};

module.exports = Connection;
