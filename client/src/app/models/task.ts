
export class Task {
  public startTs: Date;
  public endTs: Date = null;

  private hasEnded = false;

  public get IsActive(): boolean {
    return this.hasEnded;
  }

  public constructor(public name) {
    this.startTs = new Date();
  }

  public end() {
    if (this.hasEnded) {
      return;
    }

    this.endTs = new Date();
    this.hasEnded = true;
  }
}
