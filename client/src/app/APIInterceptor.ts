import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * HttpInterceptor to manage The App API base URL
 *
 * @export
 * @class APIInterceptor
 * @implements {HttpInterceptor}
 */
@Injectable()
export class APIInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      url: `http://localhost:3000/${req.url}`
    });
    return next.handle(req);
  }
}
