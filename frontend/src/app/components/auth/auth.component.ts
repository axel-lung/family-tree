import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FieldsetModule } from 'primeng/fieldset';
import { environment } from '../../environments/environment';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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
    TabsModule,
    ToastModule,
  ],
  templateUrl: 'auth.component.html',
  providers: [MessageService],
})
export class AuthComponent {
  first_name: string = '';
  last_name: string = '';
  email: string = '';
  password: string = '';
  role: string = 'guest';
  captchaToken: string = '';
  formErrors: { [key: string]: string } = {};

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    window.onCaptchaSuccess = (token: string) => {
      this.captchaToken = token;
    };
  }

  login() {
    this.formErrors = {};

    if (!this.captchaToken && environment.production) {
      console.error('Captcha non validé');
      return;
    }

    this.apiService
      .login(this.email, this.password, this.captchaToken)
      .subscribe({
        next: (response) => {
          this.authService.setUser(response.token);
          this.router.navigate(['/family-list']);
        },
        error: (err) => {
          console.log(err);
          
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: err.error,
          });
        },
      });
  }

  register() {
    this.formErrors = {};

    if (!this.captchaToken && environment.production) {
      console.error('Captcha non validé');
      return;
    }

    if (!this.isPasswordValid(this.password)) {
      this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: "Le mot de passe doit contenir au moins 8 caractères, dont 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.",
          });
      return;
    }

    this.apiService
      .register(
        this.email,
        this.password,
        this.role,
        this.first_name,
        this.last_name
      )
      .subscribe({
        next: (response) => {
          this.authService.setUser(response.token);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: err.error,
          });
        },
      });
  }

  isPasswordValid(password: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    return regex.test(password);
  }
}

declare global {
  interface Window {
    onCaptchaSuccess: (token: string) => void;
  }
}
