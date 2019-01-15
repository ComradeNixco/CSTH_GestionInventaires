import { UserService } from './../user.service';
import { UserManagementModule } from './../user-management.module';

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

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
    // TODO: Change this, it doesn't take in account the token expiracy
    const curUser = this.userSvc.currentUser;
    if (curUser && curUser.isConnected) {
      return true;
    }

    this.router.navigate([ '/login' ], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
