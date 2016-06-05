const util = require('util');
const EventEmitter = require('events');
const _ = require('underscore');
const Server = require('./server.js');
const m = require('mithril');

function Client(name, password, state, server) {
  EventEmitter.call(this);
  this.state = state;
  this.actions = [];
  this.server = server;

  var that = this;

  this.server.connect(name, password, function(err, connection) {
    if (err) return console.log(err);

    that.connection = connection;

    that.connection.on('clientUpdate', function(set) {
      _.keys(set).forEach(function(key) {
        that.update(key, set[key]);
      });
    });

    that.update('token', that.connection.id);
    that.emit('ready');
  });

};

util.inherits(Client, EventEmitter);

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
    this.server.trigger(this.state.token, name, payload);
  }
};

Client.prototype.update = function(stateKey, stateData) {
  this.state[stateKey] = stateData;
  this.emit('stateChanged', this.state);

  m.render(document.body, [
    m('h1', 'wallet'),
    m('div', this.state.wallet.map(
      function(entry) {
        return m('div', entry.amount);
      })
    )
  ]);
};

Client.prototype.action = function(action) {
  this.actions.push(action);
};

console.log(m);

module.exports = Client;
