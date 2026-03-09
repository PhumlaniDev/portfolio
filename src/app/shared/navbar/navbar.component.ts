import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { CommonModule } from '@angular/common';
import { ThemeService } from '../../service/themes/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  theme = inject(ThemeService);
  menuOpen = false;

  constructor(private router: Router) {}

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}
