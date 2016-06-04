const util = require('util');
const EventEmitter = require('events');
const _ = require('underscore');
const Connection = require('./connection.js');
const Store = require('./store.js');
const Saga = require('./saga.js');
const generateId = require('shortid');

function Server() {
  EventEmitter.call(this);
  this.connections = [];

  this.users = new Store('users');
  this.users.insert({
    username: 'username',
    password: 'password',
    id: generateId()
  });

  this.addStore('storeA');
  this.addStore('wallet');
  this.addStore('vault');
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
  const saga1 = new Saga('Saga1');

  saga1.add(
    function(token, payload, stores, cb) {
      console.log('transaction1', token);

      stores.wallet.find({token: token}, function(err, result) {
        if (err || !result.length) return cb(err, false);
        cb(null, true);
      });
    },
    function(token, payload, stores, cb) {
      console.log('compensation1', token);
      cb('foo');
    }
  );

  saga1.add(
    function(token, payload, stores, cb) {
      console.log('transaction2', token);
      cb(null, true);
    },
    function(token, payload, stores, cb) {
      console.log('compensation2', token);
      cb();
    }
  );

  saga1.run(token, payload, {
    wallet: this.wallet,
    vault: this.vault
  }, function(err, succeed) {
    console.log('saga runned', err, succeed);
  });

  this.storeA.insert({storeA: this.storeA}, function(err, res) {});
};

module.exports = Server;
