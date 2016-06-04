const util = require('util');
const EventEmitter = require('events');
const Datastore = require('nedb');
const async = require("async");

function Saga(name) {
  EventEmitter.call(this);
  this.name = name;
  this.transactions = [];
  this.compensations = [];
};

util.inherits(Saga, EventEmitter);

Saga.prototype.add = function(transaction, compensation) {
  this.transactions.push(transaction);
  this.compensations.push(compensation);
};

Saga.prototype.run = function(token, payload, stores, cb) {
  console.log(this.name, 'started');
  const that = this;

  const transactions = this.transactions.map(function(transaction) {
    return async.apply(transaction, token, payload, stores);
  });

  async.parallel(transactions, function(err, results) {
    var compensations = [];

    results.forEach(function(result, index) {
      if (result) compensations.push(that.compensations[index]);
    });

    if (compensations.length == results.length) return cb(err, true);

    compensations = compensations.map(function(compensation) {
      return async.apply(compensation, token, payload, stores);
    });

    async.parallel(compensations, function(err, results) {

      cb(err, false);
    });
  });
};

module.exports = Saga;
