import { MaterialImportModule } from './../material-import.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserService } from './user.service';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialImportModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [ LoginComponent, RegisterComponent ],
  declarations: [ LoginComponent, RegisterComponent ],
  providers: [
    UserService
  ]
})
export class UserManagementModule { }
