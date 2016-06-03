const util = require('util');
const EventEmitter = require('events');
const _ = require('underscore');
const Server = require('./server.js');

function Client(store, server) {
  EventEmitter.call(this);
  this.store = store;
  this.actions = [];
  this.server = server;

  var that = this;
  this.connection = this.server.connect();
  this.connection.on('token', function(token) {
    that.update('token', token);
    that.emit('ready');
  });
  this.connection.on('update', function(key, data) {
    that.update(key, data);
  });

};

util.inherits(Client, EventEmitter);

Client.prototype.connect = function(username, password) {
  this.connection.auth(username, password);
};

Client.prototype.isConnected = function() {
  return !!this.store.token;
};

Client.prototype.trigger = function(name, payload) {
  if (!this.isConnected()) return;

  var executed = 0;
  var that = this;

  this.actions.forEach(function(action) {
    if (action.check(name, payload, that.store)) {
      var result = action.fn(name, payload, that.store);
      _.keys(result).forEach(function(key) {
        that.update(key, result[key]);
      });
      executed++;
    }
  });

  if (!executed) {
    this.server.trigger(name, payload);
  }
};

Client.prototype.update = function(storeKey, storeData) {
  this.store[storeKey] = storeData;
  this.emit('storeChanged', this.store);
};

Client.prototype.action = function(action) {
  this.actions.push(action);
};

module.exports = Client;
