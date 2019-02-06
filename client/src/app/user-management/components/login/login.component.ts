import { UserService } from './../../user.service';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = new FormControl('', Validators.required);
  passwd = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);
  private _isLoggingIn = false;

  constructor(
    private userSvc: UserService,
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar,
    ) {}

  login() {
    this._isLoggingIn = true;
    this.userSvc.login({
      username: this.username.value.trim(),
      passwd: this.passwd.value
    }).subscribe(res => {
      this._isLoggingIn = false;
      const snack = this.snackBar.open(
        'Connection réussi! Redirection dans un instant...',
        null,
        {
          panelClass: 'snackbar-accent'
        }
      );
      let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      if (returnUrl === null) {
        returnUrl = '/';
      }

      this.router.navigateByUrl(returnUrl);
    }, err => {
    this._isLoggingIn = false;
      if (err.status === 401) {
        this.snackBar.open(
          'Erreur lors de la tentative de connection:\nPseudo ou mot de passe invalide',
          null, {
            panelClass: 'snackbar-warn'
          }
        );
      } else {
        this.snackBar.open(
          'Une erreur est survenue lors de la tentative de connection',
          null, {
            panelClass: 'snackbar-warn'
          }
        );
      }
    });
  }

  public get loginBtnColor(): string {
    if (this.username.valid && this.passwd.valid) {
      return 'primary';
    }
    return 'disabled';
  }

  public get isLoggingIn(): boolean {
    return this._isLoggingIn;
  }

  public get pwErrorMessage(): string {
    if (this.passwd.hasError('minlength')) {
      return 'Mot de Passe trop court';
    } else if (this.passwd.hasError('required')) {
      return 'Le mot de passe est requis';
    }
    return null;
  }

  public get unErrorMessage(): string {
    if (this.username.hasError('required')) {
      return 'Le pseudo est requis';
    }
    return null;
  }
}
