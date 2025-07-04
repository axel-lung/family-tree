import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PersonFacade } from '../person-facade.service';
import { PermissionService } from '../permission.service';
import { AuthService } from '../auth.service';
import { Person, User } from '@family-tree-workspace/shared-models';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-person-detail',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <p-card
      *ngIf="person"
      header="{{ person.first_name }} {{ person.last_name }}"
    >
      <p>
        <strong>Date de naissance :</strong> {{ person.birth_date || 'N/A' }}
      </p>
      <p>
        <strong>Lieu de naissance :</strong> {{ person.birth_place || 'N/A' }}
      </p>
      <p><strong>Date de décès :</strong> {{ person.death_date || 'N/A' }}</p>
      <p><strong>Biographie :</strong> {{ person.biography || 'N/A' }}</p>
      <p *ngIf="person.email && isOwnProfile">
        <strong>Email :</strong> {{ person.email }}
      </p>
      <p *ngIf="person.phone && isOwnProfile">
        <strong>Téléphone :</strong> {{ person.phone }}
      </p>
      <p *ngIf="person.residence && isOwnProfile">
        <strong>Résidence :</strong> {{ person.residence }}
      </p>
      <p>
        <strong>Photo :</strong>
        <img [src]="person.photo_url" *ngIf="person.photo_url" width="100" />
      </p>
      <p-button
        label="Modifier"
        (click)="editPerson()"
        *ngIf="canEdit"
      ></p-button>
      <p-button
        label="Supprimer"
        (click)="deletePerson()"
        styleClass="p-button-danger"
        *ngIf="canDelete"
      ></p-button>
      <p-button
        label="Partager"
        (click)="sharePerson()"
        *ngIf="canEdit"
      ></p-button>
      <p-button label="Retour à l'arbre" (click)="goToTree()"></p-button>
    </p-card>
  `,
})
export class PersonDetailComponent implements OnInit {
  person: Person | null = null;
  isOwnProfile: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  user: User | null = null;

  constructor(
    private personFacade: PersonFacade,
    private permissionService: PermissionService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe((user) => {
      this.user = user;
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.personFacade.getPerson(id).subscribe((person) => {
        this.person = person;
        if (person && this.user) {
          this.isOwnProfile = person.user_id === this.user.id;
          this.permissionService
            .checkPermission(this.user.id, id, 'can_update')
            .subscribe((canUpdate) => {
              this.canEdit =
                canUpdate || this.isOwnProfile || this.user?.role === 'admin';
            });
          this.permissionService
            .checkPermission(this.user.id, id, 'can_delete')
            .subscribe((canDelete) => {
              this.canDelete = canDelete || this.user?.role === 'admin';
            });
        }
      });
    });
  }

  sharePerson() {
    if (this.person) {
      this.http
        .post(
          'http://localhost:3333/api/share',
          { person_id: this.person.id },
          { headers: this.getHeaders() }
        )
        .subscribe({
          next: (response: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Lien généré',
              detail: `Lien: ${response.link}`,
            });
          },
          error: () =>
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Impossible de générer le lien',
            }),
        });
    }
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  editPerson() {
    if (this.person) {
      this.router.navigate(['/person-form', this.person.id]);
    }
  }

  deletePerson() {
    if (this.person) {
      this.personFacade.deletePerson(this.person.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Personne supprimée.',
          });
          this.router.navigate(['/tree']);
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la suppression.',
          }),
      });
    }
  }

  goToTree() {
    this.router.navigate(['/tree']);
  }
}
