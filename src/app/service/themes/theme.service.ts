import { Injectable, effect, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'portfolio-theme';

  isDark = signal<boolean>(this.getInitialTheme());

  constructor() {
    // this.loadTheme();

    effect(() => {
      if (this.isDark()) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem(this.THEME_KEY, this.isDark() ? 'dark' : 'light');
    });
  }

  toggle(): void {
    this.isDark.update(v => !v);
  }

  private getInitialTheme(): boolean {
    const saved = localStorage.getItem(this.THEME_KEY);
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  // private loadTheme(): void {
  //   const savedTheme = localStorage.getItem(this.THEME_KEY);
  //   if (savedTheme) {
  //     this.applyTheme(savedTheme);
  //   } else {
  //     // Default to system preference
  //     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  //     this.applyTheme(prefersDark ? 'dark' : 'light');
  //   }
  // }

  // private applyTheme(theme: string): void {
  //   console.log(`Applying theme: ${theme}`);
  //   const html = document.documentElement;
  //   if (theme === 'dark') {
  //     html.classList.add('dark');
  //     html.classList.remove('light');
  //   } else {
  //     html.classList.add('light');
  //     html.classList.remove('dark');
  //   }
  //   // html.style.backgroundColor = theme === 'dark' ? '#020817' : '#F8FAFC';
  //   // html.style.color = theme === 'dark' ? '#F8FAFC' : '#000000';
  //   localStorage.setItem(this.THEME_KEY, theme);
  // }

  // toggleTheme(): void {
  //   const currentTheme = localStorage.getItem(this.THEME_KEY) ?? 'light';
  //   const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  //   this.applyTheme(newTheme);
  // }

  // isDarkMode(): boolean {
  //   return localStorage.getItem(this.THEME_KEY) === 'dark';
  // }
}
