import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Person } from '@family-tree-workspace/shared-models';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <p-card
      *ngIf="person"
      header="{{ person.first_name }} {{ person.last_name }}"
    >
      <p>
        <strong>Date de naissance :</strong> {{ person.birth_date || 'N/A' }}
      </p>
      <p>
        <strong>Lieu de naissance :</strong> {{ person.birth_place || 'N/A' }}
      </p>
      <p><strong>Date de décès :</strong> {{ person.death_date || 'N/A' }}</p>
      <p><strong>Biographie :</strong> {{ person.biography || 'N/A' }}</p>
    </p-card>
  `,
})
export class ShareComponent implements OnInit {
  person: Person | null = null;

  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly messageService: MessageService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');
    this.http
      .get<Person>(`http://localhost:3333/api/share/${token}`)
      .subscribe({
        next: (person) => (this.person = person),
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Lien invalide ou expiré',
          }),
      });
  }
}
