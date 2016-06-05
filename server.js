const util = require('util');
const EventEmitter = require('events');
const _ = require('underscore');
const Connection = require('./connection.js');
const Store = require('./store.js');
const Saga = require('./saga.js');
const generateId = require('shortid');

const saga1 = require('./sagas/saga1.js')();

function Server() {
  EventEmitter.call(this);
  this.connections = [];

  var token = generateId();

  this.addStore('wallet');
  this.addStore('vault');
  this.addStore('users');

  this.users.insert({
    username: 'username',
    password: 'password',
    id: token
  });

  this.wallet.insert({
    amount: 500,
    id: token
  });
};

Server.prototype.addStore = function(name) {
  const that = this;

  this[name] = new Store(name);

  this[name].on('change', function(key, data) {
    that.broadcast(key, data);
  });
};

util.inherits(Server, EventEmitter);

Server.prototype.connect = function(username, password, cb) {
  const that = this;

  // add more middleware here tu put in a real server

  this.users.find({username: username, password: password}, function(err, docs) {
    if (err) return cb(err);
    if (!docs.length) return cb(new Error('invalid user'));

    var connection = new Connection(docs[0].id);
    that.connections.push(connection);

    cb(null, connection);
  });
};

Server.prototype.broadcast = function(key, data) {
  this.connections.forEach(function(connection) {
    console.log('updating', connection.id);
    connection.emit('update', key, data);
  });
};

Server.prototype.trigger = function(token, name, payload) {
  const stores = {
    wallet: this.wallet,
    vault: this.vault
  };

  switch(name) {
    case 'buy':
      saga1.run(token, payload, stores, function(err, succeed) {});
  }

};

module.exports = Server;
