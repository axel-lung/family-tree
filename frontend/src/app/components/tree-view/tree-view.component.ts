import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import f3 from 'family-chart';
import { Family } from '@family-tree-workspace/shared-models';
import { PersonFacade } from '../../services/person-facade.service';
import { FamilyService } from '../../services/family.service';
import { forkJoin, map, switchMap } from 'rxjs';

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

  constructor(
    private personFacade: PersonFacade,
    private router: Router,
    private familyService: FamilyService
  ) {}

ngOnInit(): void {
  this.familyService.getSelectedFamily().pipe(
    switchMap(family => {
      this.family = family;
      return forkJoin({
        persons: this.personFacade.getPersons(family.id),
        relationships: this.personFacade.getRelationships()
      });
    }),
    map(({ persons, relationships }) =>
      persons.map(person => {
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
          rels: { spouses, father, mother, children }
        };
      })
    )
  ).subscribe(data => this.create(data));
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

    const f3Card = f3Chart
      .setCard(f3.CardHtml)
      .setCardDisplay([['first_name', 'last_name'], ['link']])
      .setCardDim({})
      .setMiniTree(true)
      .setStyle('imageRect')
      .setOnHoverPathToMain();

    const f3EditTree = f3Chart
      .editTree()
      .fixed(true)
      .setFields(['first name', 'last name', 'birthday', 'avatar'])
      .setEditFirst(true);
    // .setCardClickOpen(f3Card);

    f3EditTree.setEdit();

    f3Chart.updateTree({ initial: true });
    // f3EditTree.open(f3Chart.getMainDatum());

    f3Chart.updateTree({ initial: true });
  }
}
