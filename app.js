function DoubleClickDetector() {
  var dcd = this
  // Get previously stored data
  let storedData = localStorage.getItem('clickDetectorData')
  // Decode previously stored data, falsy if nonexistant
  storedData = storedData && JSON.parse(storedData)

  // Merge previous data over default values
  dcd.data = Object.assign({
    count: 0,
    bestTimes: []
  }, storedData || {})
  dcd.lastTime = false
  dcd.ping = function() {
    // Get the time of this click
    let currentTime = new Date()

    // If there is a previous click, calculate the delta
    if (dcd.lastTime) {
      let timeDelta = currentTime - dcd.lastTime
      // Store the new delta
      dcd.data.bestTimes.push(timeDelta)
      // Sort the best times
      dcd.data.bestTimes.sort(function(a, b) {
        return a - b
      })
      // Truncate best times to the top 5
      dcd.data.bestTimes = dcd.data.bestTimes.slice(0, 5)
    }

    // Store the current click time as last time for the next click
    dcd.lastTime = currentTime
    dcd.data.count++

    // Store updated data in localstorage
    localStorage.setItem('clickDetectorData', JSON.stringify(dcd.data));
  }
  dcd.clear = function() {
    // Reset session data to initial state
    dcd.data = {
      count: 0,
      bestTimes: []
    }
    // Clear local storage
    localStorage.removeItem('clickDetectorData');
  }
}

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
          }, 'Click me!'),
          ' ',
          m('a[href="#"].btn.btn-secondary.clear', {
            onclick: dcd.clear,
          }, 'Clear best times'),
        ]),
        m('p', [
          'You have clicked ', dcd.data.count, ' times. Try one more.',
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
