import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../services/api.service';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, ToastModule, InputTextModule, ButtonModule, ButtonModule, CardModule, FieldsetModule, RouterModule],
  providers: [MessageService],
  templateUrl: 'reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  newPassword: string = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'] || '';
  }

  onSubmit() {
    if (!this.token) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Token manquant' });
      return;
    }

    this.apiService.resetPassword(this.token, this.newPassword).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: response.message });
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error?.error || 'Une erreur est survenue' });
      },
    });
  }
}