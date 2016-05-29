const Client = require('./client.js');

const client = new Client('user', 'password', {
  route: '/'
});

client.on('storeChanged', function(data) {
  console.log('storeChanged', data);
});

client.on('triggerServer', function(data) {
  console.log('triggerServer', data);
});

client.action(
  require('./actions/openInventory.js')
);

client.trigger('open', 'inventory');
client.trigger('open', 'map');
