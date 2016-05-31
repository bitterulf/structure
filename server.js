const util = require('util');
const EventEmitter = require('events');
const _ = require('underscore');
const Connection = require('./connection.js');
const Store = require('./store.js');

function Server() {
  EventEmitter.call(this);
  this.connections = [];
  this.store = new Store();
};

util.inherits(Server, EventEmitter);

Server.prototype.connect = function() {
  var connection = new Connection();
  this.connections.push(connection);
  return connection;
};

Server.prototype.trigger = function(name, payload) {
  console.log('server:', name, payload);
  const connections = this.connections;
  this.store.insert({}, function(err, res) {
    connections.forEach(function(connection) {
      connection.emit('update', {
        key: 'realm',
        data: {
          playerOnline: 0,
          res: res
        }
      });
    });
  });

};

module.exports = Server;
