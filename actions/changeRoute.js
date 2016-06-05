module.exports = {
  name: 'changeRoute',
  check: function (name, payload, store) {
    return name == 'changeRoute';
  },
  fn: function (name, payload, store) {
    return {
      route: payload
    };
  }
};
