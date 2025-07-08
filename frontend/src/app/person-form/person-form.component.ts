import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { PersonFacade } from '../person-facade.service';
import { Person } from '@family-tree-workspace/shared-models';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUpload } from 'primeng/fileupload';
import { FieldsetModule } from 'primeng/fieldset';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    DatePickerModule,
    FileUpload,
    FieldsetModule,
    Select,
  ],
  templateUrl: './person-form.component.html',
})
export class PersonFormComponent implements OnInit {
  person: Partial<Person> = { first_name: '', last_name: '', deleted: false };
  isEdit: boolean = false;
  isOwnProfile: boolean = false; // À implémenter avec l'utilisateur connecté
  genders: String[] | undefined;

  constructor(
    private personFacade: PersonFacade,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.genders = ['M', 'F'];
    if (id) {
      this.isEdit = true;
      this.personFacade.getPerson(Number(id)).subscribe((person) => {
        this.person = { ...person };
        // Vérifier si l'utilisateur connecté est le propriétaire (à implémenter)
        this.isOwnProfile = true; // Placeholder
      });
    }
  }

  save() {
    if (this.isEdit && this.person.id) {
      this.personFacade
        .updatePerson(this.person.id, this.person)
        .subscribe(() => {
          this.router.navigate(['/person', this.person.id]);
        });
    } else {
      this.personFacade.createPerson(this.person).subscribe(() => {
        this.router.navigate(['/tree']);
      });
    }
  }

  goBack() {
    this.router.navigate(['/tree']);
  }

  onUpload(event: any) {
    console.log('Upload event:', event);
    // handle uploaded files here
  }
}
