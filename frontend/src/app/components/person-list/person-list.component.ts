import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Family, User } from '@family-tree-workspace/shared-models';
import { catchError, concatMap, map, of, Subject } from 'rxjs';
import { PersonFacade } from '../../services/person-facade.service';
import { FamilyService } from '../../services/family.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { SelectItem, SelectModule } from 'primeng/select';
import { Router } from '@angular/router';
import { KeyFilterModule } from 'primeng/keyfilter';
import { FormsModule } from '@angular/forms';
import { DataView } from 'primeng/dataview';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    FormsModule,
    IconField,
    InputIcon,
    KeyFilterModule,
    MultiSelectModule,
    InputTextModule,
    SelectModule,
    DataView,
  ],
  templateUrl: './person-list.component.html',
  styleUrl: './person-list.component.css',
})
export class PersonListComponent {
  family: Family = { id: 0, name: '' };
  familySubscription: any = new Subject<void>();
  loading: boolean = true;
  persons = [{}];
  filteredPersons = [{}];
  searchValue: string = '';
  today: Date = new Date();
  user: User | null = null;

  constructor(
    private readonly personFacade: PersonFacade,
    private readonly familyService: FamilyService,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe((user) => {
      this.user = user;
    });
    this.familySubscription = this.familyService
      .getSelectedFamily()
      .pipe(
        concatMap((family) => {
          this.family = family;
          if (!family?.id || family?.id === 0) {
            console.error(
              'concatMap - Invalid family or family.id, returning empty data'
            );
            return of({ persons: [], relationships: [] });
          }
          // Étape 1 : Récupérer les persons
          return this.personFacade.getPersons(family.id).pipe(
            catchError((error) => {
              console.error('Error in getPersons:', error);
              return of([]);
            }),
            // Étape 2 : Récupérer les relationships
            concatMap((persons) => {
              return this.personFacade.getRelationships().pipe(
                catchError((error) => {
                  console.error('Error in getRelationships:', error);
                  return of([]);
                }),
                map((relationships) => {
                  return { persons, relationships };
                })
              );
            })
          );
        }),
        map(({ persons, relationships }) => {
          return persons.map((person) => {
            const spouses = relationships
              .filter(
                (r) =>
                  r.person2_id === person.id && r.relationship_type === 'spouse'
              )
              .map((r) => r.person1_id);

            const children = relationships
              .filter(
                (r) =>
                  r.person1_id === person.id &&
                  ['father', 'mother'].includes(r.relationship_type)
              )
              .map((r) => r.person2_id);

            const mother = relationships.find(
              (r) =>
                r.person2_id === person.id && r.relationship_type === 'mother'
            )?.person1_id;

            const father = relationships.find(
              (r) =>
                r.person2_id === person.id && r.relationship_type === 'father'
            )?.person1_id;

            if (person?.birth_date)
              person.birth_date = new Date(person.birth_date);

            return {
              id: person.id,
              gender: person.gender,
              first_name: person.first_name,
              last_name: person.last_name,
              birth_date: person.birth_date,
              avatar: person.photo,
              link: `<a class="flex" style="color:#333;text-decoration:none;padding:2px;border-radius:5px;background:white;position: absolute; right: 0; bottom: -25px" href="person/${person.id}">Voir les détails</a>`,
              rels: { spouses, father, mother, children },
            };
          });
        }),
        catchError((error) => {
          console.error('Error in subscription:', error);
          return of([]);
        })
      )
      .subscribe((data) => {
        this.persons = data;
        this.filteredPersons = this.persons;
        this.loading = false;
      });
  }

  edit(id: number) {
    this.router.navigate([`/person-form/${id}`]);
  }

  view(id: number) {
    this.router.navigate([`/person/${id}`]);
  }

  goToTree(id: number) {
    this.router.navigate([`/tree/${id}`]);
  }

  filterPersons() {
    const query = this.searchValue.toLowerCase();

    this.filteredPersons = this.persons.filter((p) =>
      JSON.stringify(p).toLowerCase().includes(query)
    );
  }
}
