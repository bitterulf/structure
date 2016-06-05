const util = require('util');
const EventEmitter = require('events');

function walletReducer(id, walletData) {
  return walletData.filter(function(entry) {
    return entry.id == id
  });
};

function usersReducer(id, usersData) {
  return usersData.filter(function(entry) {
    return entry.id == id
  });
};

function vaultReducer(id, vaultData) {
  return vaultData.filter(function(entry) {
    return entry.id == id
  });
};

function Connection(id) {
  EventEmitter.call(this);
  this.id = id;
  this.cache = {};
};

util.inherits(Connection, EventEmitter);

Connection.prototype.update = function(key, data) {
  if (key == 'wallet') {
    this.cache[key] = walletReducer(this.id, data);
  }
  else if (key == 'users') {
    this.cache[key] = usersReducer(this.id, data);
  }
  else if (key == 'vault') {
    this.cache[key] = vaultReducer(this.id, data);
  }
  else {
    this.cache[key] = data;
  }

  this.emit('clientUpdate', this.cache);
};

module.exports = Connection;
