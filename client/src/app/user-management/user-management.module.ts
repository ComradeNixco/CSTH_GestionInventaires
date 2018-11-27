import { MaterialImportModule } from '../material-import.module';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialImportModule
  ],
  exports: [ LoginComponent, RegisterComponent ],
  declarations: [ LoginComponent, RegisterComponent ]
})
export class UserManagementModule { }
