import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { Router } from '@angular/router';
import { FamilyFacade } from '../family-facade.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Family } from '@family-tree-workspace/shared-models';
import { CardModule } from 'primeng/card';
import { Fieldset } from 'primeng/fieldset';

@Component({
  selector: 'app-family-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    CardModule,
    Fieldset,
    ButtonModule,
    Select,
    ToastModule,
  ],
  templateUrl: './family-form.component.html',
  styleUrl: './family-form.component.css',
})
export class FamilyFormComponent {
  family: Partial<Family> = {};

  constructor(
    private familyFacade: FamilyFacade,
    private router: Router,
    private messageService: MessageService
  ) {}

  goBack() {
    this.router.navigate(['/tree']);
  }

  save() {
    this.familyFacade.createFamily(this.family).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Famille ajoutée avec succès',
        });
        this.router.navigate(['/tree']);
      },
      error: (err) => {
        if (err.status === 400) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Attention',
            detail: 'Cette famille existe déjà',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Une erreur est survenue lors de la création',
          });
        }
      },
    });
  }
}
