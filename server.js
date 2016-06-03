const util = require('util');
const EventEmitter = require('events');
const _ = require('underscore');
const Connection = require('./connection.js');
const Store = require('./store.js');
const generateId = require('shortid');

function Server() {
  EventEmitter.call(this);
  this.connections = [];

  this.addStore('storeA');
};

Server.prototype.addStore = function(name) {
  const that = this;

  this[name] = new Store(name);

  this[name].on('change', function(key, data) {
    that.broadcast(key, data);
  });
};

util.inherits(Server, EventEmitter);

Server.prototype.connect = function(name, password) {
  // check name and password

  const id = generateId();
  var connection = new Connection(id);
  this.connections.push(connection);
  return connection;
};

Server.prototype.broadcast = function(key, data) {
  this.connections.forEach(function(connection) {
    console.log('updating', connection.id);
    connection.emit('update', key, data);
  });
};

Server.prototype.trigger = function(name, payload) {
  console.log('server:', name, payload);
  this.storeA.insert({}, function(err, res) {});

};

module.exports = Server;
