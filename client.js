const util = require('util');
const EventEmitter = require('events');
const _ = require('underscore');

function Client(username, password, store) {
  EventEmitter.call(this);
  this.username = username;
  this.password = password;
  this.store = store;
  this.actions = [];
};

util.inherits(Client, EventEmitter);

Client.prototype.trigger = function(name, payload) {
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
    this.emit('triggerServer', { action: name, payload: payload});
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
