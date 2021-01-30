function sleep (ms) {
  return new Promise(res => setTimeout(() => res(), ms));
}

class Clock {
  constructor (bpm, callback) {
    this.run = true;
    this.bpm = bpm;
    this.count = -1;
    this.callback = callback;
  }
  async start () {
    while (this.run) {
      this.callback(++this.count);
      await sleep(60000/this.bpm);
    }
  }
}

module.exports = Clock;
