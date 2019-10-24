var dcd = new DoubleClickDetector()

var Page = {
  view: function(vnode) {
    return m('div', [
      m('header', m('div.navbar.navbar-dark.bg-dark.shadow-sm', m('div.container.d-flex.justify-content-between', [
        m('a[href="#"].navbar-brand.d-flex.align-items-center', m('strong', 'ButtonSimulator 2019'))
      ]))),
      m('main[role="main"]', m('section.jumbotron.text-center', m('div.container', [
        m('h1.jumbotron-heading', 'Click the Button!'),
        m('p', 'Test your double click speed using the button below. Your fastest times will be recorded in the high score table. Use the clear button to reset the game.'),
        m('p', [
          m('a[href="#"].btn.btn-primary.ping', {
            onclick: dcd.ping,
          }, 'Double click me!'),
          ' ',
          m('a[href="#"].btn.btn-secondary.clear', {
            onclick: dcd.clear,
          }, 'Clear best times'),
        ]),
        m('p', [
          'You have double clicked ', dcd.data.count, ' times. Try one more.',
          m('br'),
          m('h3', 'Double Click High Scores'),
          m('div.table-responsive', m('table.table.table-striped.table-sm', [
            m('thead', m('tr', [
              m('th', 'Rank'),
              m('th', 'Score (ms)')
            ])),
            m('tbody', [
              dcd.data.bestTimes.map(function(el, i) {
                return m('tr', [
                  m('td', (i + 1).toString()),
                  m('td', el.toString())
                ])
              })
            ])
          ]))
        ])
      ])))
    ])
  }
}

m.mount(document.body, Page)
