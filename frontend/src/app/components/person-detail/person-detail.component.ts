import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PersonFacade } from '../../services/person-facade.service';
import { PermissionService } from '../../services/permission.service';
import { AuthService } from '../../services/auth.service';
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
  templateUrl: './person-detail.component.html',
  styleUrl: './person-detail.component.css'
})
export class PersonDetailComponent implements OnInit {
  person: Person | null = null;
  isOwnProfile: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  user: User | null = null;

  constructor(
    private readonly personFacade: PersonFacade,
    private readonly permissionService: PermissionService,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly http: HttpClient
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe((user) => {
      this.user = user;
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.personFacade.getPerson(id).subscribe((person) => {
        this.person = person;
        if (person && this.user) {
          this.isOwnProfile = person.user_id === this.user.id;
          // this.permissionService
          //   .checkPermission(this.user.id, id, 'can_update')
          //   .subscribe((canUpdate) => {
          //     this.canEdit =
          //       canUpdate || this.isOwnProfile || this.user?.role === 'admin';
          //   });
          this.canEdit = true
          // this.permissionService
          //   .checkPermission(this.user.id, id, 'can_delete')
          //   .subscribe((canDelete) => {
          //     this.canDelete = canDelete || this.user?.role === 'admin';
          //   });
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

  goToList() {
    this.router.navigate(['/person-list']);
  }

  calculateAge(person: Person): number | string {
    if (!person.birth_date) return 'N/A';
    const birth = new Date(person.birth_date);
    const endDate = person.death_date ? new Date(person.death_date) : new Date();
    let age = endDate.getFullYear() - birth.getFullYear();
    const monthDiff = endDate.getMonth() - birth.getMonth();
    const dayDiff = endDate.getDate() - birth.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  }
}
