const Server = require('./server.js');
const Client = require('./client.js');

const server = new Server();

setTimeout(function() {
  const client = new Client('username', 'password', {}, server);

  client.action(require('./actions/openInventory.js'));

  client.on('stateChanged', function(data) {
    console.log('state change', data);
  });

  client.on('ready', function() {
    console.log('everything ready');

    // client.trigger('open', 'inventory');
    client.trigger('buy', {type: 'wood', price: 100});
  });
}, 0);
