import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(
    private auth: Auth,
    private router: Router,
  ) {}

  login() {
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then(() => {
        this.router.navigate(['/admin']);
      })
      .catch((error) => {
        console.error('Login error:', error);
        alert('Login failed. Please check your credentials and try again.');
      });
  }
}
