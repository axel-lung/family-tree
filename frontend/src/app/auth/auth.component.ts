import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, CardModule],
  template: `
    <p-card header="Authentification">
      <div class="p-fluid">
        <div class="p-field">
          <label for="email">Email</label>
          <input id="email" [(ngModel)]="email" type="email" />
        </div>
        <div class="p-field">
          <label for="password">Mot de passe</label>
          <input id="password" [(ngModel)]="password" type="password" />
        </div>
        <p-button label="Connexion" (click)="login()"></p-button>
        <p-button label="Inscription" (click)="register()" styleClass="p-button-secondary"></p-button>
      </div>
    </p-card>
  `,
})
export class AuthComponent {
  email: string = '';
  password: string = '';
  role: string = 'guest';

  constructor(private apiService: ApiService, private router: Router) {}

  login() {
    this.apiService.login(this.email, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/tree']);
      },
      error: (err) => console.error('Login failed', err),
    });
  }

  register() {
    this.apiService.register(this.email, this.password, this.role).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/tree']);
      },
      error: (err) => console.error('Registration failed', err),
    });
  }
}