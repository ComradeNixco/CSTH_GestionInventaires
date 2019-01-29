import { UserManagerComponent } from './user-management/components/user-manager/user-manager.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorComponent } from './components/error/error.component';
import { MainComponent } from './components/main/main.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

import { LoginComponent } from './user-management/components/login/login.component';
import { RegisterComponent } from './user-management/components/register/register.component';
import { AuthGuard } from './user-management/guards/auth-guard.guard';
import { AdminGuard } from './user-management/guards/admin-guard.guard';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'error/:errId', component: ErrorComponent },
  {
    path: 'ManageUser',
    component: UserManagerComponent,
    canActivate: [
      AuthGuard,
      AdminGuard
    ]
  },
  { path: '', component: MainComponent, canActivate: [ AuthGuard ] },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
