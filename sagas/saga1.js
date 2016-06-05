const Saga = require('../saga.js');

module.exports = function() {
  const saga = new Saga('Saga1');

  saga.add(
    function(token, payload, stores, cb) {
      console.log('consume money', token);

      stores.wallet.find({id: token}, function(err, entries) {
        if (err) return cb(err, false);

        var balance = 0;
        entries.forEach(function(entry) {
          balance += entry.amount;
        });

        if (balance < payload.price) {
          console.log('not enough money', balance, payload.price);
          return cb(null, false);
        }

        stores.wallet.insert({token: token, amount: payload.price * -1}, function(err, doc) {
          if (err || !doc) return cb(null, false);
          cb(null, true);
        });
      });
    },
    function(token, payload, stores, cb) {
      console.log('compensate money consumption', token);
      stores.wallet.insert({token: token, amount: payload.price}, function(err, doc) {
        if (err || !doc) return cb(null, false);
        cb(null, true);
      });
    }
  );

  saga.add(
    function(token, payload, stores, cb) {
      console.log('create item', token);
      stores.vault.insert({token: token, type: payload.type}, function(err, doc) {
        if (err || !doc) return cb(null, false);
        console.log('item created');
        cb(null, true);
      });
    },
    function(token, payload, stores, cb) {
      console.log('compensate item creation', token);
      stores.vault.remove({token: token, type: payload.type}, {}, function (err, numRemoved) {
        if (err || !numRemoved) return cb(null, false);
        console.log('item removed');
        cb(null, true);
      });
    }
  );

  return saga;
}
