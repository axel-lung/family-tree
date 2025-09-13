import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenubarComponent } from './components/menubar/menubar.component';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { FamilyService } from './services/family.service';

@Component({
  imports: [RouterModule, MenubarComponent, CommonModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
  providers: [MessageService],
})
export class App {
  protected title = 'Family Tree';

  isAuthenticated: boolean = false;
  isFamilySelected: boolean = false;

  constructor(private readonly authService: AuthService, private readonly familyService: FamilyService) {
    this.authService.getUser().subscribe((user) => {
      this.isAuthenticated = !!user;
    });

    if(this.familyService.getSelectedFamily()) this.isFamilySelected = true;
    this.familyService.getSelectedFamily().subscribe((family) => {
      this.isFamilySelected = !!family.name;
    });

  }
}
