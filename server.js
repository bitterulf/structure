const util = require('util');
const EventEmitter = require('events');
const _ = require('underscore');
const Connection = require('./connection.js');

function Server() {
  EventEmitter.call(this);
  this.connections = [];
};

util.inherits(Server, EventEmitter);

Server.prototype.connect = function() {
  var connection = new Connection();
  this.connections.push(connection);
  return connection;
};

Server.prototype.trigger = function(name, payload) {
  console.log('server:', name, payload);
  this.connections.forEach(function(connection) {
    connection.emit('update', {
      key: 'realm',
      data: {
        playerOnline: 0
      }
    });
  });

};

module.exports = Server;
