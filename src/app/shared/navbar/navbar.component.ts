import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';
import { ThemeService } from '../../service/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  isDarkMode!: boolean; // Tracks if the current theme is dark mode
  menuOpen = false; // Tracks if the mobile menu is open or closed

  constructor(
    private readonly themeService: ThemeService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.isDarkMode = this.themeService.isDarkMode();
  }

  toggleDarkMode(): void {
    this.themeService.toggleTheme();
    this.isDarkMode = this.themeService.isDarkMode();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen; // Toggles the menu state
  }

  closeMenu(): void {
    this.menuOpen = false; // Ensures the menu closes when a link is clicked
  }

  isActive(url: string): boolean {
    return this.router.url === url;
  }
}
