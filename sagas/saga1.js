const Saga = require('../saga.js');

module.exports = function() {
  const saga = new Saga('Saga1');

  saga.add(
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

  saga.add(
    function(token, payload, stores, cb) {
      console.log('transaction2', token);
      cb(null, true);
    },
    function(token, payload, stores, cb) {
      console.log('compensation2', token);
      cb();
    }
  );

  return saga;
}
