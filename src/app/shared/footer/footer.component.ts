import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  nextYear: number = this.currentYear + 1;
  countDown = '';

  ngOnInit() {
    this.updateCountDown();
  }

  updateCountDown(): void {
    const now = new Date();
    const newYear = new Date(this.nextYear, 0, 1);
    const timeDiff = newYear.getTime() - now.getTime();

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    this.countDown = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
}
