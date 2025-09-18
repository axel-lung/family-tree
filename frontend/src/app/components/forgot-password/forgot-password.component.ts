import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../services/api.service';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, ToastModule, InputTextModule, ButtonModule, ButtonModule, CardModule, FieldsetModule, RouterModule],
  providers: [MessageService],
  templateUrl: 'forgot-password.component.html'
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(private apiService: ApiService, private messageService: MessageService) {}

  onSubmit() {
    this.apiService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: response.message });
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error?.error || 'Une erreur est survenue' });
      },
    });
  }
}