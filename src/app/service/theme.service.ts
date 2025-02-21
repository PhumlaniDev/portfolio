import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly themeKey = 'theme';

  constructor() {
    this.loadTheme();
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem(this.themeKey);
    if (savedTheme) {
      this.applyTheme(savedTheme);
    } else {
      // Default to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyTheme(prefersDark ? 'dark' : 'light');
    }
  }

  private applyTheme(theme: string): void {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
    }
    html.style.backgroundColor = theme === 'dark' ? '#343541' : '#ffffff';
    html.style.color = theme === 'dark' ? '#ffffff' : '#000000';
    localStorage.setItem(this.themeKey, theme);
  }

  toggleTheme(): void {
    const currentTheme = localStorage.getItem(this.themeKey) ?? 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  isDarkMode(): boolean {
    return localStorage.getItem(this.themeKey) === 'dark';
  }
}
