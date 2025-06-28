import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { PersonDetailComponent } from './person-detail/person-detail.component';
import { AuthGuard } from './auth.guard';

export const appRoutes: Routes = [
  { path: 'login', component: AuthComponent },
  { path: 'tree', component: TreeViewComponent, canActivate: [AuthGuard] },
  {
    path: 'person/:id',
    component: PersonDetailComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
