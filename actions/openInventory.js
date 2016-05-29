module.exports = {
  name: 'openInventory',
  check: function (name, payload, store) {
    return name == 'open' && payload == 'inventory';
  },
  fn: function (name, payload, store) {
    return {
      route: '/inventory'
    };
  }
};
