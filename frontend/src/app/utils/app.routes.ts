import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from '../components/auth/auth.component';
import { PersonDetailComponent } from '../components/person-detail/person-detail.component';
import { PersonFormComponent } from '../components/person-form/person-form.component';
import { RelationshipFormComponent } from '../components/relationship-form/relationship-form.component';
import { AdminPanelComponent } from '../components/admin-panel/admin-panel.component';
import { ShareComponent } from '../components/share/share.component';
import { NgModule } from '@angular/core';
import { FamilyFormComponent } from '../components/family-form/family-form.component';
import { FamilyListComponent } from '../components/family-list/family-list.component';
import { TreeViewComponent } from '../components/tree-view/tree-view.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: AuthComponent },
  { path: 'tree', component: TreeViewComponent, canActivate: [AuthGuard] },
  { path: 'person/:id', component: PersonDetailComponent, canActivate: [AuthGuard] },
  { path: 'person-form', component: PersonFormComponent, canActivate: [AuthGuard] },
  { path: 'person-form/:id', component: PersonFormComponent, canActivate: [AuthGuard] },
  { path: 'relationship-form', component: RelationshipFormComponent, canActivate: [AuthGuard] },
  { path: 'family-form', component: FamilyFormComponent, canActivate: [AuthGuard] },
  { path: 'family-list', component: FamilyListComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard] },
  { path: 'share/:token', component: ShareComponent },
  { path: '', redirectTo: '/tree', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }