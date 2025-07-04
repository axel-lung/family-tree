import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { PersonFacade } from '../person-facade.service';
import { Person } from '@family-tree-workspace/shared-models';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    DatePickerModule,
  ],
  template: `
    <p-card
      [header]="isEdit ? 'Modifier une personne' : 'Ajouter une personne'"
    >
      <div class="p-fluid">
        <div class="p-field">
          <label for="first_name">Prénom</label>
          <input
            id="first_name"
            [(ngModel)]="person.first_name"
          />
        </div>
        <div class="p-field">
          <label for="last_name">Nom</label>
          <input
            id="last_name"
            [(ngModel)]="person.last_name"
          />
        </div>
        <div class="p-field">
          <label for="birth_date">Date de naissance</label>
          <p-datepicker
            id="birth_date"
            [(ngModel)]="person.birth_date"
            dateFormat="yy-mm-dd"
          ></p-datepicker>
        </div>
        <div class="p-field">
          <label for="birth_place">Lieu de naissance</label>
          <input
            id="birth_place"
            [(ngModel)]="person.birth_place"
          />
        </div>
        <div class="p-field">
          <label for="death_date">Date de décès</label>
          <p-datepicker
            id="death_date"
            [(ngModel)]="person.death_date"
            dateFormat="yy-mm-dd"
          ></p-datepicker>
        </div>
        <div class="p-field">
          <label for="biography">Biographie</label>
          <input
            id="biography"
            [(ngModel)]="person.biography"
          />
        </div>
        <div class="p-field" *ngIf="isOwnProfile">
          <label for="email">Email</label>
          <input id="email" [(ngModel)]="person.email"/>
        </div>
        <div class="p-field" *ngIf="isOwnProfile">
          <label for="phone">Téléphone</label>
          <input id="phone" [(ngModel)]="person.phone"/>
        </div>
        <div class="p-field" *ngIf="isOwnProfile">
          <label for="residence">Résidence</label>
          <input
            id="residence"
            [(ngModel)]="person.residence"
          />
        </div>
        <p-button label="Enregistrer" (click)="save()"></p-button>
      </div>
    </p-card>
  `,
})
export class PersonFormComponent implements OnInit {
  person: Partial<Person> = { first_name: '', last_name: '', deleted: false };
  isEdit: boolean = false;
  isOwnProfile: boolean = false; // À implémenter avec l'utilisateur connecté

  constructor(
    private personFacade: PersonFacade,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.personFacade.getPerson(Number(id)).subscribe((person) => {
        this.person = { ...person };
        // Vérifier si l'utilisateur connecté est le propriétaire (à implémenter)
        this.isOwnProfile = true; // Placeholder
      });
    }
  }

  save() {
    if (this.isEdit && this.person.id) {
      this.personFacade
        .updatePerson(this.person.id, this.person)
        .subscribe(() => {
          this.router.navigate(['/person', this.person.id]);
        });
    } else {
      this.personFacade.createPerson(this.person).subscribe(() => {
        this.router.navigate(['/tree']);
      });
    }
  }
}
