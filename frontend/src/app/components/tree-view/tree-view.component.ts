import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import f3 from 'family-chart';
import { Family } from '@family-tree-workspace/shared-models';
import { PersonFacade } from '../../services/person-facade.service';
import { FamilyService } from '../../services/family.service';
import { catchError, concatMap, map, of, Subject } from 'rxjs';

@Component({
  selector: 'app-tree-view',
  standalone: true,
  imports: [CommonModule],
  template: `<div
    id="FamilyChart"
    class="f3"
    style="width:100%;height:100vh;margin:auto;background-color:rgb(33,33,33);color:#fff;"
  ></div>`,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class TreeViewComponent implements OnInit {

  family: Family = {id: 0, name: ""};
  familySubscription: any = new Subject<void>()

  constructor(
    private readonly personFacade: PersonFacade,
    private readonly familyService: FamilyService
  ) {}

  ngOnInit(): void {
    this.familySubscription = this.familyService.getSelectedFamily().pipe(
      concatMap(family => {
        console.log('concatMap - Family:', family);
        this.family = family;
        if (!family?.id || family?.id === 0) {
          console.log('concatMap - Invalid family or family.id, returning empty data');
          return of({ persons: [], relationships: [] });
        }
        // Étape 1 : Récupérer les persons
        return this.personFacade.getPersons(family.id).pipe(
          catchError(error => {
            console.error('Error in getPersons:', error);
            return of([]);
          }),
          // Étape 2 : Récupérer les relationships
          concatMap(persons => {
            console.log('getPersons - Data:', persons);
            return this.personFacade.getRelationships().pipe(
              catchError(error => {
                console.error('Error in getRelationships:', error);
                return of([]);
              }),
              map(relationships => {
                console.log('getRelationships - Data:', relationships);
                return { persons, relationships };
              })
            );
          })
        );
      }),
      map(({ persons, relationships }) => {
        console.log('map - Data:', { persons, relationships });
        return persons.map(person => {
          const spouses = relationships
            .filter(r => r.person2_id === person.id && r.relationship_type === 'spouse')
            .map(r => r.person1_id);

          const children = relationships
            .filter(r =>
              r.person1_id === person.id &&
              ['father', 'mother'].includes(r.relationship_type)
            )
            .map(r => r.person2_id);

          const mother = relationships.find(
            r => r.person2_id === person.id && r.relationship_type === 'mother'
          )?.person1_id;

          const father = relationships.find(
            r => r.person2_id === person.id && r.relationship_type === 'father'
          )?.person1_id;

          return {
            id: person.id,
            data: {
              gender: person.gender,
              first_name: person.first_name,
              last_name: person.last_name,
              birthday: person.birth_date,
              avatar: '',
              link: `<a class="flex" style="color:#333;text-decoration:none;padding:2px;border-radius:5px;background:white;" href="person/${person.id}">Voir les détails</a>`,
            },
            rels: { spouses, father, mother, children },
          };
        });
      }),
      catchError(error => {
        console.error('Error in subscription:', error);
        return of([]);
      })
    ).subscribe(data => {
      console.log('subscribe - Chart data:', data);
      this.create(data)
    });
  }

  create(data: any) {
    const f3Chart = f3
      .createChart('#FamilyChart', data)
      .setTransitionTime(1000)
      .setCardXSpacing(350)
      .setCardYSpacing(250)
      .setSingleParentEmptyCard(false, { label: 'ADD' })
      .setShowSiblingsOfMain(true)
      .setOrientationVertical()
      .setAncestryDepth(10)
      .setProgenyDepth(10)
      .setPrivateCardsConfig(false);

    f3Chart
      .setCard(f3.CardHtml)
      .setCardDisplay([['first_name', 'last_name'], ['link']])
      .setCardDim({})
      .setMiniTree(true)
      .setStyle('imageRect')
      .setOnHoverPathToMain();

    f3Chart.updateTree({ initial: true });
  }
}
