import { ChangeDetectorRef, NgZone, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  pure: false,
})
export class TimeAgoPipe implements PipeTransform {
  private lastValue: any;
  private lastText: string = '';
  private timer: any;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
  ) {}

  transform(value: any): string {
    if (!value) return '';

    if (this.lastValue !== value) {
      this.lastValue = value;
      this.lastText = this.format(value);
      this.removeTimer();
      this.createTimer();
    }

    return this.lastText;
  }

  format(value: any): string {
    let date = value.seconds ? new Date(value.seconds * 1000) : new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds} sec${seconds === 1 ? '' : 's'} ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;

    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  createTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  removeTimer() {
    this.ngZone.runOutsideAngular(() => {
      this.timer = setTimeout(() => {
        this.ngZone.run(() => {
          this.changeDetectorRef.markForCheck();
          this.createTimer();
        });
      }, 60000);
    });
  }
}
