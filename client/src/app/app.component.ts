import { UserService } from './user-management/user.service';
import { User } from './user-management/models/user';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(public userSvc: UserService) {}

  public get currentUser(): User {
    return this.userSvc.currentUser;
  }

  public get IsCurrentUserAdmin(): boolean {
    return this.currentUser && this.currentUser.isAdmin;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
