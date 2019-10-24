function DoubleClickDetector() {
  var dcd = this
  // Get previously stored data
  let storedData = localStorage.getItem('clickDetectorData')
  // Decode previously stored data, falsy if nonexistant
  storedData = storedData && JSON.parse(storedData)

  // Double click threshold setting
  const THRESHOLD = 500

  // Merge previous data over default values
  dcd.data = Object.assign({
    count: 0,
    bestTimes: []
  }, storedData || {})
  dcd.lastTime = false
  dcd.ping = function() {
    // Get the time of this click
    var currentTime = new Date()
    // If there is a previous click, calculate the delta
    if (dcd.lastTime) {
      let timeDelta = currentTime - dcd.lastTime
      // Only count double clicks that are fast enough
      if (timeDelta < THRESHOLD) {
        // Store the new delta
        dcd.data.bestTimes.push(timeDelta)
        // Sort the best times
        dcd.data.bestTimes.sort(function(a, b) {
          return a - b
        })
        // Truncate best times to the top 5
        dcd.data.bestTimes = dcd.data.bestTimes.slice(0, 5)
        // Increment count of double clicks
        dcd.data.count++
        // Clear lastTime to not count the final click as the start of the next double click
        dcd.lastTime = false
      } else {
        // If threshold was not met, count this click as the first click
        dcd.lastTime = currentTime
      }
    } else {
      // Store the current click time as last time for the next click
      dcd.lastTime = currentTime
    }
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
