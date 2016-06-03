const util = require('util');
const EventEmitter = require('events');

function Connection(id) {
  EventEmitter.call(this);
  this.id = id;
};

util.inherits(Connection, EventEmitter);

module.exports = Connection;
