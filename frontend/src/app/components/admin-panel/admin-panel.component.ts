import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule  } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { User, Permission } from '@family-tree-workspace/shared-models';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToggleSwitchModule ,
    FormsModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './admin-panel.component.html'
})
export class AdminPanelComponent implements OnInit {
  users: User[] = [];
  permissions: Permission[] = [];

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe((user) => {
      if (user?.role !== 'admin') {
        this.messageService.add({
          severity: 'error',
          summary: 'Accès interdit',
          detail: 'Réservé aux admins',
        });
        return;
      }
      this.loadUsers();
      this.loadPermissions();
    });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  loadUsers() {
    this.http
      .get<User[]>('http://localhost:3333/api/users', {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: (users) => (this.users = users),
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de charger les utilisateurs',
          }),
      });
  }

  loadPermissions() {
    this.http
      .get<Permission[]>('http://localhost:3333/api/permissions/0', {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: (permissions) => (this.permissions = permissions),
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de charger les permissions',
          }),
      });
  }

  editUser(user: User) {
    // À implémenter : formulaire pour modifier l'utilisateur
  }

  deleteUser(id: number) {
    this.http
      .delete(`http://localhost:3333/api/users/${id}`, {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: () => {
          this.users = this.users.filter((u) => u.id !== id);
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Utilisateur supprimé',
          });
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de supprimer l’utilisateur',
          }),
      });
  }

  updatePermission(perm: Permission) {
    this.http
      .post('http://localhost:3333/api/users/permissions', perm, {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: () =>
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Permission mise à jour',
          }),
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de mettre à jour la permission',
          }),
      });
  }
}
