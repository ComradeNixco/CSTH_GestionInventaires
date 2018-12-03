import { UserService } from './../../user.service';

import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = new FormControl('', Validators.required);
  passwd = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);

  message = '';

  constructor(
    private userSvc: UserService,
    public snackBar: MatSnackBar
    ) {}

  ngOnInit() {
  }

  login() {
    this.userSvc.login({
      username: this.username.value,
      passwd: this.passwd.value
    }).subscribe(res => {
      const snack = this.snackBar.open(
        'Connection réussi! Redirection dans un instant...',
        null,
        {
          panelClass: 'snackbar-accent'
        }
      );
    }, err => {
      const snack = this.snackBar.open(
        'Impossible de se connecter',
        null, {
          panelClass: 'snackbar-warn'
        }
      );
    });
  }


  public get loginBtnColor() : string {
    if (this.username.valid && this.passwd.valid) {
      return 'primary';
    }

    return 'disabled';
  }

}
