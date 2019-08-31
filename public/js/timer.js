var Timer = {
  ticksPerSecond: 20,
  timeAtLastFrame: Date.now(),
  idealTimePerFrame: 1000 / 20,
  leftover: 0,
  test: 0,
  test2: 0,
  init: function() {
  },
  update: function() {
    var timeAtThisFrame = window.performance.now();
    var timeSinceLastDoLogic = (timeAtThisFrame - this.timeAtLastFrame) + this.leftover;
    this.test = Math.floor(timeSinceLastDoLogic / this.idealTimePerFrame);
    this.timeAtLastFrame = timeAtThisFrame;
    this.leftover = timeSinceLastDoLogic - (this.test * this.idealTimePerFrame);
    this.test2 = this.leftover / this.idealTimePerFrame;
    console.log(this.test2);
  },
  getTime: function() {
    return window.performance && window.performance.now ? window.performance.now() : Date.now();
  }
};
