export class Timer {

  constructor({ duration = 5000, elapsed = 0, perf = window.performance}) {
    this.duration = duration;
    this.elapsed = elapsed;
    this.perf = perf;
  }

  changeDuration() {
    this.elapsed = 0;
    this.last_time = this.perf.now();
    this.stop();
  }

  update() {
    const time = this.perf.now();
    this.elapsed += Math.min(
      time - this.last_time,
      this.duration - this.elapsed
    );
    this.last_time = time;
    return this.elapsed < this.duration;
  }

  start() {
    this.last_time = this.perf.now();
    this.update();
  }
}
