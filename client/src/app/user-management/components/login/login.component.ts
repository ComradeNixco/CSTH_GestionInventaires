import { UserService } from './../../user.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = 'test';
  passwd = 'Password01$';
  message = '';

  constructor(
    private userSvc: UserService,
    public snackBar: MatSnackBar
    ) {}

  ngOnInit() {
  }

  login() {
    this.userSvc.login({
      username: this.username,
      passwd: this.passwd
    }).subscribe(res => {
      let snack = this.snackBar.open(
        'OwO',
        null,
        {
          panelClass: 'snackbar-accent'
        }
      );
    }, err => {
      let snack = this.snackBar.open(
        'Impossible de se connecter',
        null, {
          panelClass: 'snackbar-warn'
        }
      );
    });
  }
}
