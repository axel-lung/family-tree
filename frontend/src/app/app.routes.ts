import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { PersonDetailComponent } from './person-detail/person-detail.component';
import { AuthGuard } from './auth.guard';
import { PersonFormComponent } from './person-form/person-form.component';
import { RelationshipFormComponent } from './relationship-form/relationship-form.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { ShareComponent } from './share/share.component';
import { NgModule } from '@angular/core';
import { FamilyFormComponent } from './family-form/family-form.component';
import { FamilyListComponent } from './family-list/family-list.component';

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