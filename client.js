const util = require('util');
const EventEmitter = require('events');
const _ = require('underscore');
const Server = require('./server.js');

function Client(name, password, state, server) {
  EventEmitter.call(this);
  this.state = state;
  this.actions = [];
  this.server = server;

  var that = this;
  this.connection = this.server.connect(name, password);
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
  return !!this.state.token;
};

Client.prototype.trigger = function(name, payload) {
  if (!this.isConnected()) return;

  var executed = 0;
  var that = this;

  this.actions.forEach(function(action) {
    if (action.check(name, payload, that.state)) {
      var result = action.fn(name, payload, that.state);
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

Client.prototype.update = function(stateKey, stateData) {
  this.state[stateKey] = stateData;
  this.emit('stateChanged', this.state);
};

Client.prototype.action = function(action) {
  this.actions.push(action);
};

module.exports = Client;
