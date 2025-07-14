import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcome } from './nx-welcome';
import { MenubarComponent } from './menubar/menubar.component';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { FamilyService } from './family.service';

@Component({
  imports: [NxWelcome, RouterModule, MenubarComponent, CommonModule],
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

  constructor(private authService: AuthService, private familyService: FamilyService) {
    this.authService.getUser().subscribe((user) => {
      this.isAuthenticated = !!user;
    });

    if(this.familyService.getSelectedFamily()) this.isFamilySelected = true;
    this.familyService.getSelectedFamily().subscribe((family) => {
      this.isFamilySelected = !!family.name;
    });

  }
}
