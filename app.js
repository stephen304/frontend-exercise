function Thinger() {
  var thinger = this
  thinger.count = 0
  thinger.bestTimes = []
  thinger.lastTime = false
  thinger.ping = function() {
    // Get the time of this click
    let currentTime = new Date()

    // If there is a previous click, calculate the delta
    if (thinger.lastTime) {
      let timeDelta = currentTime - thinger.lastTime
      // Store the new delta
      thinger.bestTimes.push(timeDelta)
      // Sort the best times
      thinger.bestTimes.sort(function(a, b) {
        return a - b
      })
      // Truncate best times to the top 5
      thinger.bestTimes = thinger.bestTimes.slice(0, 5)
    }

    // Store the current click time as last time for the next click
    thinger.lastTime = currentTime
    thinger.count++
  }
}

var thinger = new Thinger()

var Page = {
  view: function(vnode) {
    return m('div', [
      m('p', 'Here is a button.'),
      m('button', {
        onclick: thinger.ping,
      }, 'Click me!'),
      m('p', 'You have clicked ', thinger.count, ' times. Try one more.'),
      m('ul', [
        'Top 5 Double Click Intervals:',
        thinger.bestTimes.map(function(t) {
          return m('li', [
            m('span', {
              class: 'clicktime'
            }, [t.toString(), ' milliseconds'])
          ])
        }),
      ]),
    ])
  },
}

m.mount(document.body, Page)
