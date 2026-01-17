import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { User, Permission, UsersFamilies } from '@family-tree-workspace/shared-models';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ApiService } from '../../services/api.service';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FamilyFacade } from '../../services/family-facade.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToggleSwitchModule,
    FormsModule,
    ToastModule,
    IconField,
    InputIcon,
    KeyFilterModule,
    MultiSelectModule,
    InputTextModule,
    SelectModule,
  ],
  providers: [MessageService],
  templateUrl: './admin-panel.component.html',
})
export class AdminPanelComponent implements OnInit {
  users: User[] = [];
  permissions: Permission[] = [];
  searchValue: string = "";
  roles = ["admin", "family_manager", "family_member", "guest"]
  currentUserId!: number;
  usersfamilies: UsersFamilies[] | null = []

  constructor(
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
    private readonly apiService: ApiService,
    private readonly familyFacade: FamilyFacade
  ) {}

  ngOnInit() {
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
      this.loadUsers();
    });

    this.familyFacade.getUsersFamiliesFromUser(this.currentUserId).subscribe({
      next: (usersfamilies) => (this.usersfamilies = usersfamilies),
      error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de charger les users families',
          }),
      });
    }

  loadUsers() {
      return this.apiService.loadUsers().subscribe({
        next: (users) => (this.users = users),
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de charger les utilisateurs',
          }),
      });
  }

  manageAcessUser(id: number, active: boolean) {
    let detail = 'Utilisateur ';
    detail += active ? 'débloqué' : 'bloqué';
    return this.apiService.editUser(id, active).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== id);
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: detail,
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: "Erreur lors de la mise à jour de l'utilisateur",
        });
      },
    });
  }

  updateRole(id: number, role: string) {
    return this.apiService.editUser(id, {role: role}).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== id);
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Utilisateur modifié',
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: "Erreur lors de la mise à jour de l'utilisateur",
        });
      },
    });
  }
}
