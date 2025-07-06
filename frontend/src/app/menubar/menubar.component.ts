import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../auth.service';
import { PermissionService } from '../permission.service';
import { User } from '@family-tree-workspace/shared-models';

@Component({
  selector: 'app-menubar',
  standalone: true,
  imports: [
    MenubarModule,
    CommonModule,
    RouterModule,
    AvatarModule,
    AvatarGroupModule,
    BadgeModule,
    OverlayBadgeModule,
    InputGroupAddonModule,
    InputGroupModule,
    ButtonModule,
  ],
  template: `
    <p-menubar [model]="items">
      <ng-template #start> </ng-template>

      <ng-template #end>
        <div class="flex gap-2">
          <p-inputgroup>
            <input pInputText placeholder="Prénom NOM" />
            <p-button label="Chercher" />
          </p-inputgroup>
          <p-button
            *ngIf="isAuthenticated"
            label="Déconnexion"
            (click)="logout()"
            styleClass="p-button-outlined"
          ></p-button>
        </div>
      </ng-template>
    </p-menubar>
  `,
  styles: [],
})
export class MenubarComponent {
  user: User | null = null;
  items: MenuItem[] = [];
  isAuthenticated: boolean = false;

  constructor(
    private permissionService: PermissionService,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.authService.getUser().subscribe((user) => {
      this.isAuthenticated = !!user;
      this.items = this.items.map((item) => ({
        ...item,
        visible:
          item.label === 'Administration' ? user?.role === 'admin' : true,
      }));
    });
  }

  ngOnInit() {
    this.authService.getUser().subscribe((user) => {
      this.user = user;
    });

    this.items.push({
      label: 'Arbre généalogique LUNG',
      icon: 'pi pi-home',
      routerLink: ['/tree'],
    });

    if (this.user?.role === 'admin') {
      this.items.push({
        label: 'Ajouter une personne',
        icon: 'pi pi-user-plus',
        routerLink: ['/person-form'],
      });
    }

    if (this.user?.role === 'admin') {
      this.items.push({
        label: 'Ajouter une relation',
        icon: 'pi pi-link',
        routerLink: ['/relationship-form'],
      });
    }

    if (this.user?.role === 'admin') {
      this.items.push({
        label: 'Admin Panel',
        icon: 'pi pi-cog',
        routerLink: ['/admin'],
      });
    }
  }

  logout() {
    this.authService.logout();
    this.messageService.add({
      severity: 'success',
      summary: 'Déconnexion',
      detail: 'Vous êtes déconnecté.',
    });
    this.router.navigate(['/login']);
  }
}
