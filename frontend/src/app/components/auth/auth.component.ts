import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs/operators';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  styleUrls: ['auth.component.css'],
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
export class AuthComponent implements OnInit {
  first_name = '';
  last_name = '';
  email = '';
  password = '';
  role: 'guest' | 'admin' | 'user' = 'guest';
  captchaToken = '';

  private scriptLoaded = false;
  private widgetId?: string;

  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly el: ElementRef,
  ) {}

  ngOnInit(): void {
    this.loadTurnstileScript(() => this.renderTurnstile());
  }

  // ---- CAPTCHA ----
  private loadTurnstileScript(callback: () => void): void {
    if (this.scriptLoaded) {
      callback();
      return;
    }

    const script = document.createElement('script');
    script.src =
      'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback';
    script.defer = true;

    (window as any).onloadTurnstileCallback = () => {
      this.scriptLoaded = true;
      callback();
    };

    document.body.appendChild(script);
  }

  private renderTurnstile(): void {
    const container = this.el.nativeElement.querySelector('#captcha');
    if (!(window as any).turnstile || !container) {
      console.error('Turnstile API non disponible');
      return;
    }

    this.widgetId = (window as any).turnstile.render(container, {
      sitekey: '0x4AAAAAABlzlgQkHqL3WmTc', 
      callback: (token: string) => (this.captchaToken = token),
    });
  }

  private resetCaptcha(): void {
    if (this.widgetId) {
      (window as any).turnstile.reset(this.widgetId);
      this.captchaToken = '';
    }
  }

  private ensureCaptchaValid(): boolean {
    if (!this.captchaToken) {
      this.showError('Captcha non validé');
      return false;
    }
    return true;
  }

  
  login(): void {
    if (!this.ensureCaptchaValid()) return;

    this.apiService
      .login(this.email, this.password, this.captchaToken)
      .pipe(take(1))
      .subscribe({
        next: ({ token }) => {
          this.authService.setUser(token);
          this.router.navigate(['/family-list']);
        },
        error: (err) => this.handleApiError(err),
      });
  }

  register(): void {
    if (!this.ensureCaptchaValid()) return;

    if (!this.isPasswordValid(this.password)) {
      this.showError(
        'Le mot de passe doit contenir au moins 8 caractères, dont 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.',
      );
      return;
    }

    this.apiService
      .register(
        this.email,
        this.password,
        this.role,
        this.first_name,
        this.last_name,
        this.captchaToken,
      )
      .pipe(take(1))
      .subscribe({
        next: ({ token }) => {
          this.authService.setUser(token);
          this.router.navigate(['/login']);
          this.showSuccess(
            "Demande créée, en attente de validation d'un administrateur",
          );
        },
        error: (err) => this.handleApiError(err),
      });
  }

  // ---- UTILS ----
  private isPasswordValid(password: string): boolean {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    return regex.test(password);
  }

  private handleApiError(err: any): void {
    console.error(err);
    this.showError(err?.error ?? 'Erreur inconnue');
    this.resetCaptcha();
  }

  private showError(detail: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail,
    });
  }

  private showSuccess(detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Succès',
      detail,
    });
  }
}
