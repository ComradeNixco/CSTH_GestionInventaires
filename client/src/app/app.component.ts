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

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
