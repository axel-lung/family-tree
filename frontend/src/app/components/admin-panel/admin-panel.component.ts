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
  template: `
    <p-toast></p-toast>
    <h2>Panneau d'administration</h2>
    <p-table [value]="users" [tableStyle]="{ 'min-width': '50rem' }">
      <ng-template pTemplate="header">
        <tr>
          <th>Email</th>
          <th>Rôle</th>
          <th>Actions</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-user>
        <tr>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <p-button
              label="Modifier"
              (click)="editUser(user)"
              styleClass="p-button-sm"
            ></p-button>
            <p-button
              label="Supprimer"
              (click)="deleteUser(user.id)"
              styleClass="p-button-danger p-button-sm"
            ></p-button>
          </td>
        </tr>
      </ng-template>
    </p-table>
    <h3>Gérer les permissions</h3>
    <p-table [value]="users" [tableStyle]="{ 'min-width': '50rem' }">
      <ng-template pTemplate="header">
        <tr>
          <th>Utilisateur</th>
          <th>Personne</th>
          <th>Créer</th>
          <th>Modifier</th>
          <th>Supprimer</th>
          <th>Actions</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-perm>
        <tr>
          <td>{{ perm.user_id }}</td>
          <td>{{ perm.person_id }}</td>
          <td>
            <p-toggleswitch
              [(ngModel)]="perm.can_create"
              (onChange)="updatePermission(perm)"
            ></p-toggleswitch>
          </td>
          <td>
            <p-toggleswitch
              [(ngModel)]="perm.can_update"
              (onChange)="updatePermission(perm)"
            ></p-toggleswitch>
          </td>
          <td>
            <p-toggleswitch
              [(ngModel)]="perm.can_delete"
              (onChange)="updatePermission(perm)"
            ></p-toggleswitch>
          </td>
          <td>
            <p-button
              label="Enregistrer"
              (click)="updatePermission(perm)"
              styleClass="p-button-sm"
            ></p-button>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class AdminPanelComponent implements OnInit {
  users: User[] = [];
  permissions: Permission[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private messageService: MessageService
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
