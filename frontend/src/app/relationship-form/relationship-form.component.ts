import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PersonFacade } from '../person-facade.service';
import { Relationship } from '@family-tree-workspace/shared-models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-relationship-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    CardModule,
  ],
  template: `
    <p-card header="Ajouter une relation">
      <div class="p-fluid">
        <div class="p-field">
          <label for="person1">Personne 1</label>
          <p-dropdown
            id="person1"
            [options]="persons"
            [(ngModel)]="relationship.person1_id"
            optionLabel="label"
            optionValue="id"
          ></p-dropdown>
        </div>
        <div class="p-field">
          <label for="person2">Personne 2</label>
          <p-dropdown
            id="person2"
            [options]="persons"
            [(ngModel)]="relationship.person2_id"
            optionLabel="label"
            optionValue="id"
          ></p-dropdown>
        </div>
        <div class="p-field">
          <label for="relationship_type">Type de relation</label>
          <p-dropdown
            id="relationship_type"
            [options]="relationshipTypes"
            [(ngModel)]="relationship.relationship_type"
            optionLabel="label"
            optionValue="value"
          ></p-dropdown>
        </div>
        <p-button label="Enregistrer" (click)="save()"></p-button>
      </div>
    </p-card>
  `,
})
export class RelationshipFormComponent implements OnInit {
  relationship: Partial<Relationship> = { relationship_type: 'parent' };
  persons: { id: number; label: string }[] = [];
  relationshipTypes = [
    { label: 'Parent', value: 'parent' },
    { label: 'Enfant', value: 'child' },
    { label: 'Conjoint', value: 'spouse' },
  ];

  constructor(private personFacade: PersonFacade, private router: Router) {}

  ngOnInit() {
    this.personFacade.getPersons().subscribe((persons) => {
      this.persons = persons.map((p) => ({
        id: p.id,
        label: `${p.first_name} ${p.last_name}`,
      }));
    });
  }

  save() {
    this.personFacade.createRelationship(this.relationship).subscribe(() => {
      this.router.navigate(['/tree']);
    });
  }
}
