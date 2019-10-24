require('../js/DoubleClickDetector.js');

// console.log(other);
console.log(DoubleClickDetector);

jasmine.clock().install();
var baseTime = new Date(2013, 9, 23);
var dcd;

describe("DoubleClickDetector", function() {
  beforeEach(function() {
    dcd = new DoubleClickDetector();
  });

  it("registers a double click", function() {
    jasmine.clock().mockDate(baseTime);

    dcd.ping();
    jasmine.clock().tick(50);
    dcd.ping();

    expect(dcd.data).toEqual({
      count: 1,
      bestTimes: [50]
    });
  });

  it("records multiple scores", function() {
    jasmine.clock().mockDate(baseTime);

    dcd.ping();
    jasmine.clock().tick(40);
    dcd.ping();

    jasmine.clock().tick(100);

    dcd.ping();
    jasmine.clock().tick(50);
    dcd.ping();

    jasmine.clock().tick(100);

    dcd.ping();
    jasmine.clock().tick(60);
    dcd.ping();

    expect(dcd.data).toEqual({
      count: 3,
      bestTimes: [40, 50, 60]
    });
  });

  it("sorts multiple scores ascending", function() {
    jasmine.clock().mockDate(baseTime);

    dcd.ping();
    jasmine.clock().tick(80);
    dcd.ping();

    jasmine.clock().tick(100);

    dcd.ping();
    jasmine.clock().tick(40);
    dcd.ping();

    jasmine.clock().tick(100);

    dcd.ping();
    jasmine.clock().tick(60);
    dcd.ping();

    expect(dcd.data).toEqual({
      count: 3,
      bestTimes: [40, 60, 80]
    });
  });

  it("truncates greater than 5 records but retains total count", function() {
    jasmine.clock().mockDate(baseTime);

    dcd.ping();
    jasmine.clock().tick(30);
    dcd.ping();

    jasmine.clock().tick(100);

    dcd.ping();
    jasmine.clock().tick(60);
    dcd.ping();

    jasmine.clock().tick(100);

    dcd.ping();
    jasmine.clock().tick(50);
    dcd.ping();

    jasmine.clock().tick(100);

    dcd.ping();
    jasmine.clock().tick(20);
    dcd.ping();

    jasmine.clock().tick(100);

    dcd.ping();
    jasmine.clock().tick(10);
    dcd.ping();

    jasmine.clock().tick(100);

    dcd.ping();
    jasmine.clock().tick(40);
    dcd.ping();

    expect(dcd.data).toEqual({
      count: 6,
      bestTimes: [10, 20, 30, 40, 50]
    });
  });

  it("doesn't count clicks after the threshold", function() {
    jasmine.clock().mockDate(baseTime);

    dcd.ping();
    jasmine.clock().tick(550);
    dcd.ping();
    jasmine.clock().tick(550);
    dcd.ping();
    jasmine.clock().tick(50);
    dcd.ping();
    jasmine.clock().tick(550);
    dcd.ping();
    jasmine.clock().tick(560);
    dcd.ping();

    expect(dcd.data).toEqual({
      count: 1,
      bestTimes: [50]
    });
  });

  it("saves a failed second click for use as a first click", function() {
    jasmine.clock().mockDate(baseTime);

    dcd.ping();
    jasmine.clock().tick(550);
    dcd.ping();
    jasmine.clock().tick(10);
    dcd.ping();

    expect(dcd.data).toEqual({
      count: 1,
      bestTimes: [10]
    });
  });

  it("doesn't count the second click of a successful double click as a potential first click", function() {
    jasmine.clock().mockDate(baseTime);

    dcd.ping();
    jasmine.clock().tick(50);
    dcd.ping();
    jasmine.clock().tick(10);
    dcd.ping();

    expect(dcd.data).toEqual({
      count: 1,
      bestTimes: [50]
    });
  });
});
