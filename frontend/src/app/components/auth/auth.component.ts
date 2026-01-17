import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Fieldset, FieldsetModule } from 'primeng/fieldset';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs/operators';
import { NgZone } from '@angular/core';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { InstallPwaButtonComponent } from '../install-pwa-button/install-pwa-button.component';
import { FamilyFacade } from '../../services/family-facade.service';
import { Select } from 'primeng/select';

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
    RouterModule,
    InstallPwaButtonComponent,
    Select,
    Fieldset
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
  showPassword = false;
  family_id = 0;

  private widgetId?: string;
  families: { id: number; name: string }[] = [];

  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly el: ElementRef,
    private readonly zone: NgZone,
    private cdr: ChangeDetectorRef,
    private readonly familyFacade: FamilyFacade,
  ) {}

  ngOnInit(): void {
    this.loadTurnstileExplicit();
    this.familyFacade.getFamilies().subscribe((families) => {
      this.families = families.map((f) => ({
        id: f.id,
        name: f.name,
      }));
    });
  }

  ngOnDestroy(): void {
    if (this.widgetId && (window as any).turnstile) {
      (window as any).turnstile.remove(this.widgetId);
    }
  }

  // 1. Chargement du script en mode "explicit" (recommandé par Cloudflare)
  private loadTurnstileExplicit(): void {
    if ((window as any).turnstile) {
      this.renderInvisibleTurnstile();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => this.renderInvisibleTurnstile();
    document.head.appendChild(script);
  }

  // 2. Render invisible (aucun widget visible !)
  private renderInvisibleTurnstile(): void {
    if (!(window as any).turnstile) return;

    this.widgetId = (window as any).turnstile.render('#turnstile-invisible', {
      sitekey: '0x4AAAAAABlzlgQkHqL3WmTc', // ← Utilise un sitekey invisible (1x...)
      
      retry: 'auto',
      'retry-delay': 2000,
      callback: (token: string) => {
        this.zone.run(() => {
          this.captchaToken = token;
          this.cdr.detectChanges();
        });
      },
      'error-callback': (err: string) => {
        this.captchaToken = '';
      },
      'expired-callback': () => {
        this.captchaToken = '';
      }
    });
  }

  private executeTurnstile(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.widgetId || !(window as any).turnstile) {
        reject('Turnstile non disponible');
        return;
      }

      // Callback temporaire
      const tempCallback = (token: string) => {
        resolve(token);
      };

      (window as any).turnstile.execute(this.widgetId, {
        callback: tempCallback
      });
    });
  }

  
  async login(): Promise<void> {
    try {
      const token = await this.executeTurnstile(); // ← Ici on force l'exécution
      this.captchaToken = token;

      this.apiService.login(this.email, this.password, token)
        .pipe(take(1))
        .subscribe({
          next: ({ token }) => {
            this.authService.setUser(token);
            this.router.navigate(['/family-list']);
          },
          error: (err) => this.handleApiError(err)
        });
    } catch (err) {
      this.showError('Impossible de valider le captcha. Réessayez.');
    }
  }

  register(): void {
    // if (!this.ensureCaptchaValid()) return;

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
        this.family_id,
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
    // this.resetCaptcha();
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
