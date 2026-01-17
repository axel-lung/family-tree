import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FamilyFacade } from '../../services/family-facade.service';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { Fieldset } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { FamilyService } from '../../services/family.service';
import { MessageService } from 'primeng/api';
import { UsersFamilies } from '@family-tree-workspace/shared-models';
import { AuthService } from '../../services/auth.service';

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
export class FamilyListComponent implements OnInit {
  families: { id: number; name: string }[] = [];
  selectedFamilyId: number = 0;
  currentUserId!: number;

  constructor(
    private readonly familyService: FamilyService,
    private readonly authService: AuthService,
    private readonly familyFacade: FamilyFacade,
    private readonly router: Router,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {

    this.authService.getUser().subscribe((user) => {
      if(user?.id) this.currentUserId = user.id
      if (user?.role !== 'admin') {
        this.messageService.add({
          severity: 'error',
          summary: 'Accès interdit',
          detail: 'Réservé aux admins',
        });
        return;
      }
    });

    this.familyFacade.getFamilies().subscribe((families) => {
      this.families = families.map((f) => ({ id: f.id, name: f.name }));
    });

    this.familyFacade
      .getUsersFamiliesFromUser(this.currentUserId)
      .subscribe((links) => {
        if(!links) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de charger la liste, recharge la page',
          });
        }else{
          const idsOK = links.map((l) => l.family_id);
          this.families = this.families.filter((f) => idsOK.includes(f.id));
        }
      });
  }

  goTree() {
    const family = this.families.find((f) => f.id === this.selectedFamilyId);
    if (family) {
      this.familyService.setSelectedFamily(family);
      this.router.navigate(['/tree']);
    }
  }
}
