const m = require('mithril');

function renderWallet(wallet) {
  if (!wallet) return '';

  var balance = 0;
  wallet.forEach(
    function(entry) {
      balance += entry.amount;
    }
  );

  return [
    m('h1', 'wallet ('+balance+')'),
    m('div', wallet.map(
      function(entry) {
        return m('div', entry.amount);
      })
    )
  ];
};

module.exports = function(state, trigger) {
  m.render(document.body, [
    m('div', {
      onclick: function() {
        trigger('testAction', {});
      }
    }, 'clicker'),
    renderWallet(state.wallet)
  ]);
};
