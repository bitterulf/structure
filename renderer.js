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

function renderMarket(trigger) {
  return [
    m('h1', 'market'),
    m('div', {
      onclick: function() {
        trigger('buy', {
          type: 'wood',
          price: 100
        });
      }
    }, 'buy Wood')
  ];
};

function renderMenu(route, trigger) {
  if (route == 'wallet') {
    return m('div', [
      m('div', {
        onclick: function() {
          trigger('changeRoute', '');
        }
      }, 'back')
    ]);
  }
  else if (route == 'market') {
    return m('div', [
      m('div', {
        onclick: function() {
          trigger('changeRoute', '');
        }
      }, 'back')
    ]);
  }
  else {
    return m('div', [
      m('div', {
        onclick: function() {
          trigger('changeRoute', 'wallet');
        }
      }, 'wallet'),
      m('div', {
        onclick: function() {
          trigger('changeRoute', 'market');
        }
      }, 'market')
    ]);
  }
};

module.exports = function(state, trigger) {
  m.render(document.body, [
    renderMenu(state.route, trigger),
    state.route == 'wallet' ? renderWallet(state.wallet) : '',
    state.route == 'market' ? renderMarket(trigger) : ''
  ]);
};
