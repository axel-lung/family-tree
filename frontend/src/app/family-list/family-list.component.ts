import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FamilyFacade } from '../family-facade.service';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { Fieldset } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { FamilyService } from '../family.service';

@Component({
  selector: 'app-family-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    Fieldset,
    ButtonModule,
    Select,
  ],
  templateUrl: './family-list.component.html',
  styleUrl: './family-list.component.css',
})
export class FamilyListComponent {
  families: { id: number; name: string }[] = [];
  selectedFamilyId: number = 0;

  constructor(
    private familyService: FamilyService,
    private familyFacade: FamilyFacade,
    private router: Router
  ) {}

  ngOnInit() {
    this.familyFacade.getFamilies().subscribe((families) => {
      this.families = families.map((f) => ({
        id: f.id,
        name: f.name,
      }));
    });
  }

  goTree() {
    const family = this.families.find((f) => f.id === this.selectedFamilyId);
    if (family) {
      this.familyService.setSelectedFamily(family);
      console.log("OK");
      console.log(family);
      
      
      this.router.navigate(['/tree']);
    }
  }
}
