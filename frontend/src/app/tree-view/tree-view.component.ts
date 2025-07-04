import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonFacade } from '../person-facade.service';
import { Person, Relationship } from '@family-tree-workspace/shared-models';
import { Router } from '@angular/router';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

cytoscape.use(dagre); // Enregistrement du layout dagre

@Component({
  selector: 'app-tree-view',
  standalone: true,
  imports: [CommonModule],
  template: ` <div #cy class="cytoscape-container"></div> `,
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
  @ViewChild('cy', { static: true }) cyContainer!: ElementRef;
  private cy!: cytoscape.Core;

  constructor(private personFacade: PersonFacade, private router: Router) {}

  ngOnInit() {
    this.personFacade.getPersons().subscribe((persons) => {
      console.log(persons);
      this.personFacade.getRelationships().subscribe((relationships) => {
        this.initCytoscape(persons, relationships);
      });
    });
  }

  initCytoscape(persons: Person[], relationships: Relationship[]) {
    const elements = this.buildElements(persons, relationships);

    this.cy = cytoscape({
      container: this.cyContainer.nativeElement,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#007ad9',
            label: 'data(label)',
            color: '#fff',
            'text-valign': 'center',
            'text-halign': 'center',
            width: '100px',
            height: '40px',
            'border-width': '2px',
            'border-color': '#004d99',
            padding: '10px',
          },
        },
        {
          selector: 'node.deleted',
          style: {
            'background-color': '#dc3545',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'line-color': '#007ad9',
            'curve-style': 'bezier',
          },
        },
        {
          selector: 'edge.spouse',
          style: {
            'line-style': 'dashed',
            'line-color': '#28a745',
          },
        },
      ],
      layout: {
        name: 'dagre', // Layout hiérarchique pour arbre généalogique
      },
    });

    this.cy.on('tap', 'node', (event) => {
      const person = event.target.data('person') as Person;
      this.personFacade.getPerson(person.id);
      this.router.navigate(['/person', person.id]);
    });
  }

  buildElements(
    persons: Person[],
    relationships: Relationship[]
  ): cytoscape.ElementDefinition[] {
    const elements: cytoscape.ElementDefinition[] = [];

    // Ajouter les nœuds (personnes)
    persons.forEach((person) => {
      if (!person.deleted) {
        elements.push({
          data: {
            id: `person-${person.id}`,
            label: `${person.first_name} ${person.last_name}`,
            person,
          },
          classes: person.deleted ? 'deleted' : '',
        });
      }
    });

    // Ajouter les arêtes (relations)
    relationships.forEach((rel) => {
      if (rel.relationship_type === 'child') {
        elements.push({
          data: {
            source: `person-${rel.person1_id}`,
            target: `person-${rel.person2_id}`,
          },
        });
      } else if (rel.relationship_type === 'spouse') {
        elements.push({
          data: {
            source: `person-${rel.person1_id}`,
            target: `person-${rel.person2_id}`,
          },
          classes: 'spouse',
        });
      }
    });

    return elements;
  }
}
