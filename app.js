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
      m('p', 'Here is a button.'),
      m('button.ping', {
        onclick: dcd.ping,
      }, 'Click me!'),
      m('button.clear', {
        onclick: dcd.clear,
      }, 'Clear best times'),
      m('p', 'You have clicked ', dcd.data.count, ' times. Try one more.'),
      m('ul', [
        'Top 5 Double Click Intervals:',
        dcd.data.bestTimes.map(function(t) {
          return m('li', [
            m('span.clicktime', [t.toString(), ' milliseconds'])
          ])
        }),
      ]),
    ])
  },
}

m.mount(document.body, Page)
