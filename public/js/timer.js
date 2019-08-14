var Timer = {
  ticksPerSecond: 20,
  timerSpeed: 1,
  elapsedTicks: 0,
  elapsedPartialTicks: 0,
  renderPartialTicks: 0,
  lastSyncSysClock: 0,
  lastSyncHRClock: 0,
  lastHRTime: 0,
  timeSyncAdjustment: 1,
  nextTick: 0,
  test: false,
  init: function() {
    this.lastSyncSysClock = this.getTime();
    this.lastSyncHRClock = this.getTime();
  },
  update: function() {
    var now = this.getTime();
    var delta = now - this.lastSyncSysClock;
    var millis = this.getTime();
    var secs = millis / 1000;

    if (this.test) {
      console.log("");
      console.log("now:" + now);
      console.log("delta:" + delta);
      console.log("millis:" + millis);
      console.log("secs:" + secs);
    }

    if (delta >= 0 && delta <= 1000) {
      this.nextTick += delta;
      if (this.nextTick > 1000) {
        console.log("here");
        var deltaHR = millis - this.lastSyncHRClock;
        var n = this.nextTick / deltaHR;
        this.timeSyncAdjustment += (n - this.timeSyncAdjustment) * 0.20000000298023224;
        this.lastSyncHRClock = millis;
        this.nextTick = 0;
      }

      if (this.nextTick < 0) {
        this.lastSyncHRClock = millis;
      }
    } else {
      this.lastHRTime = secs;
    }

    this.lastSyncSysClock = now;
    var nn = (secs - this.lastHRTime) * this.timeSyncAdjustment;
    this.lastHRTime = secs;

    if (nn < 0) nn = 0;
    if (nn > 1) nn = 1;

    this.elapsedPartialTicks += nn * this.timerSpeed * this.ticksPerSecond;
    this.elapsedTicks = parseInt(this.elapsedPartialTicks);
    this.elapsedPartialTicks -= this.elapsedTicks;

    if (this.elapsedTicks > 10) this.elapsedTicks = 10;

    this.renderPartialTicks = this.elapsedPartialTicks;

    if (this.test) {
      console.log("nn:" + nn);
      console.log("elapsedPartialTicks:" + this.elapsedPartialTicks);
      console.log("elapsedTicks:" + this.elapsedTicks);
      console.log("renderPartialTicks:" + this.renderPartialTicks);
      console.log("");
    }

    //console.log("milli:" + this.getTime());
    //console.log("micro:" + this.getTime() * 1000);
    //console.log("nano:" + this.getTime() * 1000000);
  },
  getTime: function() {
    return window.performance.now();
  }
};
