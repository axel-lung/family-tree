import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { PersonDetailComponent } from './person-detail/person-detail.component';
import { AuthGuard } from './auth.guard';
import { PersonFormComponent } from './person-form/person-form.component';
import { RelationshipFormComponent } from './relationship-form/relationship-form.component';

export const routes: Routes = [
  { path: 'login', component: AuthComponent },
  { path: 'tree', component: TreeViewComponent, canActivate: [AuthGuard] },
  { path: 'person/:id', component: PersonDetailComponent, canActivate: [AuthGuard] },
  { path: 'person-form', component: PersonFormComponent, canActivate: [AuthGuard] },
  { path: 'person-form/:id', component: PersonFormComponent, canActivate: [AuthGuard] },
  { path: 'relationship-form', component: RelationshipFormComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];