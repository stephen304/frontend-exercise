function Thinger() {
  var thinger = this
  // Get previously stored data
  let storedData = localStorage.getItem('clickDetectorData')
  // Decode previously stored data, falsy if nonexistant
  storedData = storedData && JSON.parse(storedData)

  // Merge previous data over default values
  thinger.data = Object.assign({
    count: 0,
    bestTimes: []
  }, storedData || {})
  thinger.lastTime = false
  thinger.ping = function() {
    // Get the time of this click
    let currentTime = new Date()

    // If there is a previous click, calculate the delta
    if (thinger.lastTime) {
      let timeDelta = currentTime - thinger.lastTime
      // Store the new delta
      thinger.data.bestTimes.push(timeDelta)
      // Sort the best times
      thinger.data.bestTimes.sort(function(a, b) {
        return a - b
      })
      // Truncate best times to the top 5
      thinger.data.bestTimes = thinger.data.bestTimes.slice(0, 5)
    }

    // Store the current click time as last time for the next click
    thinger.lastTime = currentTime
    thinger.data.count++

    // Store updated data in localstorage
    localStorage.setItem('clickDetectorData', JSON.stringify(thinger.data));
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
      m('p', 'You have clicked ', thinger.data.count, ' times. Try one more.'),
      m('ul', [
        'Top 5 Double Click Intervals:',
        thinger.data.bestTimes.map(function(t) {
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
