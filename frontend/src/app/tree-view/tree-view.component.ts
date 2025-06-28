import { Component, OnInit } from '@angular/core';
   import { CommonModule } from '@angular/common';
   import { OrganizationChartModule } from 'primeng/organizationchart';
   import { TreeNode } from 'primeng/api';
   import { PersonFacade } from '../person-facade.service';
   import { Person, Relationship } from '@family-tree-workspace/shared-models';
   import { Router } from '@angular/router';

   @Component({
     selector: 'app-tree-view',
     standalone: true,
     imports: [CommonModule, OrganizationChartModule],
     template: `
       <p-organizationChart [value]="treeNodes" (onNodeSelect)="onNodeSelect($event)">
         <ng-template let-node pTemplate="person">
           <div class="node-content" [ngClass]="{'deleted': node.data.deleted}">
             <span>{{ node.label }}</span>
             <span *ngIf="node.data.spouse" class="spouse">Conjoint: {{ node.data.spouse.first_name }} {{ node.data.spouse.last_name }}</span>
           </div>
         </ng-template>
       </p-organizationChart>
     `,
     styles: [`
       .node-content {
         padding: 15px;
         border: 2px solid #007ad9;
         border-radius: 8px;
         background-color: #f8f9fa;
         cursor: pointer;
         text-align: center;
       }
       .node-content.deleted {
         border-color: #dc3545;
         background-color: #f8d7da;
         opacity: 0.6;
       }
       .spouse {
         display: block;
         font-size: 0.9em;
         color: #555;
       }
       :host ::ng-deep .p-organizationchart .p-organizationchart-node-content {
         padding: 0;
       }
       :host ::ng-deep .p-organizationchart .p-organizationchart-line {
         border-color: #007ad9;
       }
     `],
   })
   export class TreeViewComponent implements OnInit {
     treeNodes: TreeNode[] = [];

     constructor(private personFacade: PersonFacade, private router: Router) {}

     ngOnInit() {
       this.personFacade.getPersons().subscribe(persons => {
         this.personFacade.getRelationships().subscribe(relationships => {
           this.treeNodes = this.buildTreeNodes(persons, relationships);
         });
       });
     }

     buildTreeNodes(persons: Person[], relationships: Relationship[]): TreeNode[] {
       const nodes: TreeNode[] = [];
       const personMap = new Map<number, Person>(persons.map(p => [p.id, p]));
       const hasParent = new Set(relationships.filter(r => r.relationship_type === 'child').map(r => r.person2_id));
       const roots = persons.filter(p => !hasParent.has(p.id) && !p.deleted);

       roots.forEach(root => {
         nodes.push(this.buildNode(root, personMap, relationships));
       });

       return nodes;
     }

     buildNode(person: Person, personMap: Map<number, Person>, relationships: Relationship[]): TreeNode {
       const children: TreeNode[] = [];
       const childRelationships = relationships.filter(r => r.relationship_type === 'child' && r.person1_id === person.id);
       const spouseRelationships = relationships.filter(r => r.relationship_type === 'spouse' && r.person1_id === person.id);

       childRelationships.forEach(rel => {
         const child = personMap.get(rel.person2_id);
         if (child && !child.deleted) {
           children.push(this.buildNode(child, personMap, relationships));
         }
       });

       const spouse = spouseRelationships.length > 0 ? personMap.get(spouseRelationships[0].person2_id) : undefined;

       return {
         label: `${person.first_name} ${person.last_name}`,
         data: { ...person, spouse },
         expanded: false,
         children,
       };
     }

     onNodeSelect(event: any) {
       const person = event.node.data as Person;
       this.personFacade.getPerson(person.id);
       this.router.navigate(['/person', person.id]);
     }
   }