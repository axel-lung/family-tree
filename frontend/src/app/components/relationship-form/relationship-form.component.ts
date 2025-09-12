import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PersonFacade } from '../../services/person-facade.service';
import { Family, Relationship } from '@family-tree-workspace/shared-models';
import { Router } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FamilyService } from '../../services/family.service';

@Component({
  selector: 'app-relationship-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    CardModule,
    SelectModule,
    ToastModule,
  ],
  template: `
    <p-toast />
    <p-card header="Ajouter une relation">
      <div class="p-fluid pt-6">
        <div class="p-field">
          <p-select
            [options]="persons"
            [(ngModel)]="relationship.person1_id"
            optionLabel="label"
            optionValue="id"
            [filter]="true"
            placeholder="Choisir une personne"
            class="w-full md:w-56"
          />
        </div>
        <span> est </span>
        <div class="p-field">
          <p-dropdown
            id="relationship_type"
            [options]="relationshipTypes"
            [(ngModel)]="relationship.relationship_type"
            optionLabel="label"
            optionValue="value"
          ></p-dropdown>
        </div>
        <span> de </span>
        <div class="p-field mb-6">
          <p-select
            [options]="persons"
            [(ngModel)]="relationship.person2_id"
            optionLabel="label"
            optionValue="id"
            [filter]="true"
            placeholder="Choisir une personne"
            class="w-full md:w-56"
          />
        </div>
        <div class="mt-6 flex justify-content-center p-field col-12">
          <p-button
            class="mr-4"
            label="Annuler"
            variant="text"
            severity="danger"
            (click)="goBack()"
          />
          <p-button label="Enregistrer" (click)="save()"></p-button>
        </div>
      </div>
    </p-card>
  `,
})
export class RelationshipFormComponent implements OnInit {
  relationship: Partial<Relationship> = { relationship_type: 'mother' };
  persons: { id: number; label: string }[] = [];
  relationshipTypes = [
    { label: 'Père', value: 'father' },
    { label: 'Mère', value: 'mother' },
    { label: 'Conjoint', value: 'spouse' },
  ];
  family: Family = {id: 0, name:""};

  constructor(
    private personFacade: PersonFacade,
    private router: Router,
    private messageService: MessageService,
    private familyService: FamilyService
  ) {}

  ngOnInit() {
    this.familyService.getSelectedFamily().subscribe(f => this.family = f);
    this.personFacade.getPersons(this.family.id).subscribe((persons) => {
      this.persons = persons.map((p) => ({
        id: p.id,
        label: `${p.first_name} ${p.last_name}`,
      }));
    });
  }

  goBack() {
    this.router.navigate(['/tree']);
  }

  save() {
    if (
      this.relationship.relationship_type == 'father' ||
      this.relationship.relationship_type == 'mother'
    ) {
      const relationshipChild: Partial<Relationship> = {
        person1_id: this.relationship.person2_id,
        person2_id: this.relationship.person1_id,
        relationship_type: 'child',
      };
      this.personFacade.createRelationship(relationshipChild).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Relation ajoutée avec succès',
          });
        },
        error: (err) => {
          if (err.status === 400) {

            this.messageService.add({
              severity: 'warn',
              summary: 'Attention',
              detail: 'Cette relation existe déjà',
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

    if (this.relationship.relationship_type == 'spouse') {
      const relationshipSpouse: Partial<Relationship> = {
        person1_id: this.relationship.person2_id,
        person2_id: this.relationship.person1_id,
        relationship_type: 'spouse',
      };
      this.personFacade.createRelationship(relationshipSpouse).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Relation ajoutée avec succès',
          });
        },
        error: (err) => {
          if (err.status === 400) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Attention',
              detail: 'Cette relation existe déjà',
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

    this.personFacade.createRelationship(this.relationship).subscribe(() => {
      this.router.navigate(['/tree']);
    });
  }
}
