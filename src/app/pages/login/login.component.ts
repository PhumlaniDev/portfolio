import { Component, OnInit } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoadingService } from '../../service/spinner/loading.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  loginForm!: FormGroup;

  constructor(
    private auth: Auth,
    private router: Router,
    private fb: FormBuilder,
    private loading: LoadingService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.loading.show('Logging in...');
      setTimeout(() => {
        const formData = this.loginForm.value;
        this.email = formData.email;
        this.password = formData.password;
        this.loading.hide();
        signInWithEmailAndPassword(this.auth, this.email, this.password)
          .then(() => {
            this.router.navigateByUrl('/blog/admin', { replaceUrl: true });
          })
          .catch((error) => {
            console.error('Login error:', error);
            alert('Login failed. Please check your credentials and try again.');
          });
      }, 2500);
    } else {
      this.loginForm.markAllAsTouched();
      alert('Please fill in the form correctly before submitting.');
    }
  }
}
