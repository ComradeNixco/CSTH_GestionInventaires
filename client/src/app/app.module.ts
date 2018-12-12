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
import { TaskPipe } from './pipes/task.pipe';



@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    TaskPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppConfigModule,
    MaterialImportModule,
    UserManagementModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: APIInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
