import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { AppConfigModule } from './app-config/app-config.module';
import { APIInterceptor } from './APIInterceptor';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialImportModule } from './material-import.module';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { UserManagementModule } from './user-management/user-management.module';
import { ErrorComponent } from './components/error/error.component';



@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppConfigModule,
    MaterialImportModule,
    UserManagementModule,
    MatPasswordStrengthModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: APIInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
