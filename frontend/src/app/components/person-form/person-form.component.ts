import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { PersonFacade } from '../../services/person-facade.service';
import { Person } from '@family-tree-workspace/shared-models';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUpload, FileUploadHandlerEvent } from 'primeng/fileupload';
import { FieldsetModule } from 'primeng/fieldset';
import { Select } from 'primeng/select';
import { FamilyService } from '../../services/family.service';

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
  person: Partial<Person> = {};
  isEdit: boolean = false;
  isOwnProfile: boolean = false; // À implémenter avec l'utilisateur connecté
  genders: string[] | undefined;

  constructor(
    private readonly personFacade: PersonFacade,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly familyService: FamilyService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.genders = ['M', 'F'];
    this.familyService.getSelectedFamily().subscribe(f => this.person.family_id = f.id);
    if (id) {
      this.isEdit = true;
      this.personFacade.getPerson(Number(id)).subscribe((person) => {
        this.person = { ...person };
        if (person?.birth_date) this.person.birth_date = new Date(person.birth_date)  
        if (person?.death_date) this.person.death_date = new Date(person.death_date)  
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

  onUpload(event: FileUploadHandlerEvent) {
    if (event.files && event.files.length > 0) {
      const file = event.files[0]; // fichier sélectionné
      if (file.size > 8 * 1024 * 1024) { // 2MB
        alert('Fichier trop lourd !');
        return;
      }
      const reader = new FileReader();

      reader.onload = () => {
        // Stocke directement le base64 dans person.photo
        this.person.photo = reader.result as string;
      };

      reader.readAsDataURL(file); // lance la conversion en base64
    }
  }
}