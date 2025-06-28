import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PersonFacade } from '../person-facade.service';
import { Person } from '@family-tree-workspace/shared-models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-person-detail',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  template: `
    <p-card *ngIf="person" header="{{ person.first_name }} {{ person.last_name }}">
      <p><strong>Date de naissance :</strong> {{ person.birth_date || 'N/A' }}</p>
      <p><strong>Lieu de naissance :</strong> {{ person.birth_place || 'N/A' }}</p>
      <p><strong>Date de décès :</strong> {{ person.death_date || 'N/A' }}</p>
      <p><strong>Biographie :</strong> {{ person.biography || 'N/A' }}</p>
      <p *ngIf="person.email && isOwnProfile"><strong>Email :</strong> {{ person.email }}</p>
      <p *ngIf="person.phone && isOwnProfile"><strong>Téléphone :</strong> {{ person.phone }}</p>
      <p *ngIf="person.residence && isOwnProfile"><strong>Résidence :</strong> {{ person.residence }}</p>
      <p><strong>Photo :</strong> <img [src]="person.photo_url" *ngIf="person.photo_url" width="100" /></p>
      <p-button label="Modifier" (click)="editPerson()" *ngIf="canEdit"></p-button>
      <p-button label="Supprimer" (click)="deletePerson()" styleClass="p-button-danger" *ngIf="canDelete"></p-button>
    </p-card>
  `,
})
export class PersonDetailComponent implements OnInit {
  person: Person | null = null;
  isOwnProfile: boolean = false;
  canEdit: boolean = false; // À implémenter avec RBAC
  canDelete: boolean = false; // À implémenter avec RBAC

  constructor(
    private personFacade: PersonFacade,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.personFacade.getPerson(id).subscribe(person => {
      this.person = person;
      // Vérifier si l'utilisateur connecté est le propriétaire (à implémenter)
      this.isOwnProfile = true; // Placeholder
    });
  }

  editPerson() {
    // À implémenter : formulaire de modification
  }

  deletePerson() {
    if (this.person) {
      this.personFacade.deletePerson(this.person.id).subscribe();
    }
  }
}