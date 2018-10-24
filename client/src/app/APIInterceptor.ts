import { AppConfig, /*TK_APP_CONFIG*/ } from './app-config/app-config.module';
import { Injectable, Inject } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

// REVIEW: the DI part might not work, this needs to be reviewed when the API will be actually used in the client app

/**
 * HttpInterceptor to manage The App API base URL
 * Transforms api:// to API_BASE_URL/
 *
 * @export
 * @class APIInterceptor
 * @implements {HttpInterceptor}
 */
@Injectable()
export class APIInterceptor implements HttpInterceptor {
  constructor(/*@Inject(TK_APP_CONFIG)*/ private appSettings: AppConfig) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req && req.url.startsWith('api://')) {
      req = req.clone({
        url: `${this.appSettings.apiBaseUrl}/${req.url.substr(6)}`
      });
    }
    return next.handle(req);
  }
}
