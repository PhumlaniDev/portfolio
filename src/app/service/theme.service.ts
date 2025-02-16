import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkModeKey = 'dark-mode';

  constructor() {
    this.loadTheme();
  }

  toggleTheme(): void {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem(this.darkModeKey, 'light');
    } else {
      html.classList.add('dark');
      localStorage.setItem(this.darkModeKey, 'dark');
    }
  }

  loadTheme(): void {
    const storedTheme = localStorage.getItem(this.darkModeKey);
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }
}
