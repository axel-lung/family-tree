import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonFacade } from '../person-facade.service';
import { Router } from '@angular/router';
import f3 from 'family-chart';
import { FamilyService } from '../family.service';
import { Family } from '@family-tree-workspace/shared-models';

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

  ngOnInit() {
    this.familyService.getSelectedFamily().subscribe(f => this.family = f);
    this.personFacade.getPersons(this.family.id).subscribe((persons) => {
      this.personFacade.getRelationships().subscribe((relationships) => {
        let data: any = [];

        console.log(persons);
        

        persons.forEach((person) => {
          const spouseRel = relationships.filter(
            (relationship) =>
              relationship.person2_id === person.id &&
              relationship.relationship_type === 'spouse'
          );
          let allspouses: any = [];
          spouseRel.forEach((spouse) => {
            allspouses.push(spouse.person1_id);
          });

          const childrenRel = relationships.filter(
            (relationship) =>
              relationship.person1_id === person.id &&
              (relationship.relationship_type === 'father' ||
                relationship.relationship_type === 'mother')
          );

          let allchildren: any = [];
          childrenRel.forEach((child) => {
            allchildren.push(child.person2_id);
          });

          let motherId: any = '';
          const motherRel = relationships.find(
            (relationship) =>
              relationship.person2_id === person.id &&
              relationship.relationship_type === 'mother'
          );
          motherId = motherRel?.person1_id;

          let fatherId: any = '';
          const fatherRel = relationships.find(
            (relationship) =>
              relationship.person2_id === person.id &&
              relationship.relationship_type === 'father'
          );
          fatherId = fatherRel?.person1_id;

          data.push({
            id: person.id,
            data: {
              gender: person.gender,
              'first name': person.first_name,
              'last name': person.last_name,
              birthday: person.birth_date,
              avatar: '',
              tes:
                '<a class="flex" style="color: #333; text-decoration: none;padding: 2px; border-radius: 5px; background: white;" href="person/' +
                person.id +
                '">Voir les détails</a>',
            },
            rels: {
              spouses: allspouses,
              father: fatherId,
              mother: motherId,
              children: allchildren,
            },
          });
        });

        this.create(data);
      });
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

    const f3Card = f3Chart
      .setCard(f3.CardHtml)
      .setCardDisplay([['first name', 'last name'], ['tes']])
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
