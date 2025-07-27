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

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    FieldsetModule
  ],
  template: `
    <p-card header="Mes origines de famille" class="flex justify-content-center">
      <div class="p-fluid">
        <div class="p-field col-3">
          <p-fieldset legend="Email">
          <input id="email" pInputText [(ngModel)]="email" type="email" />
          </p-fieldset>
        </div>
        <div class="p-field col-3">
          <p-fieldset legend="Mot de passe">
          <input id="password" pInputText [(ngModel)]="password" type="password" />
          </p-fieldset>
        </div>
        <p-button class="flex justify-content-center" label="Connexion" (click)="register()"></p-button>
      </div>
    </p-card>
  `,
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  role: string = 'guest';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

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
