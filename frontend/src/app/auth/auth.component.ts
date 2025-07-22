import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FieldsetModule } from 'primeng/fieldset';
import { environment } from '../environments/environment';


@Component({
  selector: 'app-auth',
  standalone: true,
  styleUrl: 'auth.component.css',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    FieldsetModule,
  ],
  templateUrl: 'auth.component.html',
})
export class AuthComponent {
  email: string = '';
  password: string = '';
  role: string = 'guest';
  captchaToken: string = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {
    window.onCaptchaSuccess = (token: string) => {
      this.captchaToken = token;
    };
  }

  login() {
    console.log(environment.production);
    
    if (!this.captchaToken && environment.production) {
      console.error('Captcha non validé');
      return;
    }
    console.log("connexion en cours");
    
    this.apiService.login(this.email, this.password, this.captchaToken).subscribe({
      next: (response) => {
        this.authService.setUser(response.token);
        this.router.navigate(['/family-list']);
      },
      error: (err) => console.error('Erreur lors de la connexion', err),
    });
  }

  register() {
    this.apiService.register(this.email, this.password, this.role).subscribe({
      next: (response) => {
        this.authService.setUser(response.token);
        this.router.navigate(['/tree']);
      },
      error: (err) => console.error('Registration failed', err),
    });
  }
}

declare global {
  interface Window {
    onCaptchaSuccess: (token: string) => void;
  }
}
