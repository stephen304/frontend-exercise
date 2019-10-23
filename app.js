function Thinger() {
  var thinger = this
  thinger.count = 0
  thinger.times = []
  thinger.ping = function() {
    thinger.count++
    thinger.times.push(new Date())
  }
}

var thinger = new Thinger()

var Page = {
  view: function(vnode) {
    return m('div', [
      m('p', 'Here is a button.'),
      m('button', {
        onclick: thinger.ping,
      }, 'click me!'),
      m('p', 'You have clicked ', thinger.count, ' times. Try one more.'),
      m('ul', [
        'Click times:',
        thinger.times.map(function(t) {
          return m('li', [
            m('span', {
              class: 'clicktime'
            }, t.toString())
          ])
        }),
      ]),
    ])
  },
}

m.mount(document.body, Page)
