import { MaterialImportModule } from '../material-import.module';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserService } from './user.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialImportModule
  ],
  exports: [ LoginComponent, RegisterComponent ],
  declarations: [ LoginComponent, RegisterComponent ],
  providers: [
    UserService
  ]
})
export class UserManagementModule { }
