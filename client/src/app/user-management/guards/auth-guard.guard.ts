import { UserService } from './../user.service';
import { UserManagementModule } from './../user-management.module';
import { User } from './../models/user';

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: UserManagementModule
})
export class AuthGuard implements CanActivate {
  constructor(
    private userSvc: UserService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.userSvc.isLoggedIn()) {
      return true;
    }

    this.router.navigate([ '/login' ], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
