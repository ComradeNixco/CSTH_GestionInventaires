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
    const curUser = this.userSvc.getCurrentUser();
    if (curUser && curUser.isActive && curUser.isAdmin) {
      return true;
    }

    // TODO: change url to go to a warning page letting user know it's an admin only route
    // TODO: and confirming him to login as an admin
    this.router.navigate([ '/error/NeedsAdmin' ]);
    return false;
  }
}
