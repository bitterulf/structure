const Server = require('./server.js');
const Client = require('./client.js');

const server = new Server();
const client = new Client('bob', 'password', {}, server);

client.action(require('./actions/openInventory.js'));

client.on('stateChanged', function(data) {
  console.log('state change', data);
});

client.on('ready', function() {
  console.log('everything ready');

  client.trigger('open', 'inventory');
  client.trigger('open', 'map');
});

client.connect('username', 'password');
