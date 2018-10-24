import { environment } from './../../environments/environment.prod';
import { NgModule, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';


// export const TK_APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export class AppConfig {
  apiBaseUrl: string;
}

const APP_CONFIG: AppConfig = {
  apiBaseUrl: environment.apiBaseUrl
};

@NgModule({
  providers: [{
    provide: AppConfig,
    useValue: APP_CONFIG
  }]
})
export class AppConfigModule { }
