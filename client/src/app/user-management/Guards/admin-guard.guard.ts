import { UserService } from './../user.service';

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';

import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private userSvc: UserService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const curUser = this.userSvc.currentUser;
    if (this.userSvc.isLoggedIn() && curUser.isAdmin) {
      return true;
    }

    this.router.navigate([ '/error/NeedsAdmin' ]);
    return false;
  }
}
