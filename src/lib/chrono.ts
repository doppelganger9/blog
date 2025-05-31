export class Timer {
  private last_time: number;
  public duration: number = 5000; // milliseconds
  public elapsed = 0;  // milliseconds
  private perf = window.performance;

  constructor({duration = 5000, elapsed = 0, perf}) {
    this.duration = duration;
    this.elapsed = elapsed;
    this.perf = perf;
  }

  changeDuration(): void {
    this.elapsed = 0;
    this.last_time = this.perf.now();
    this.stop();
  }

  update(): boolean {
    const time = this.perf.now();
    this.elapsed += Math.min(
      time - this.last_time,
      this.duration - this.elapsed
    );
    this.last_time = time;
    return this.elapsed < this.duration;
  }

  start(): void {
    this.last_time = this.perf.now();
    this.update();
  }

  stop(): void {
    // nothing.
  }
}
