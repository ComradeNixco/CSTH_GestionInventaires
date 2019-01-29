
import AuthPayload from './models/authPayload';
import { User, TokenResponse } from './models/user';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  throwError as observableThrowError,
  Observable,
  BehaviorSubject
} from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class UserService {
  private _token: string;
  private readonly TOKEN_STORAGE_KEY = 'api.user.token';

  constructor(private http: HttpClient, private router: Router) {
    this._token = localStorage.getItem(this.TOKEN_STORAGE_KEY) || '';
  }

  /**
   * Logs out the current user by erasing from memory and from it's token before 'returning' to the root route
   *
   * @memberof UserService
   */
  public logout(): void {
    this.token = '';
    this.router.navigate(['login']);
  }

  public get currentUser(): User {
    return this.getUserFromToken(this.token);
  }

  /**
   * Détermine si il y a actuellement un User de connecté au nvieau de l'application
   *
   * @returns Vrai si un User est connecté, faux sinon ou si son token a expiré
   */
  public isLoggedIn(): boolean {
    const curUser = this.currentUser;
    let ret = !!curUser;
    ret = ret && curUser.isActive;
    ret = ret && curUser.exp > Date.now() / 1000;
    return ret;
  }

  // API Calls

  public register(user: AuthPayload): Observable<any> {
    return this.apiRequest('register', 'post', false, user);
  }

  public login(user: AuthPayload): Observable<TokenResponse> {
    return this.apiRequest('login', 'post', false, user);
  }

  public getUsers(): Observable<User[]> {
    return this.apiRequest('', 'get', true);
  }

  public toggleIsActive(user: User) {
    return this.toggleProperty(user, 'isActive');
  }

  public toggleIsAdmin(user: User) {
    return this.toggleProperty(user, 'isAdmin');
  }

  private toggleProperty(user: User, property: string): Observable<any> {
    return this.apiRequest(`${user.username}/${property}`, 'post', true).pipe(
      tap(_ => {
        const currentUser = this.getUserFromToken(this.token);
        if (currentUser && currentUser.username === user.username) {
          this.logout();
        }
      })
    );
  }

  /**
   * The current user's token
   */
  private get token(): string {
    return this._token;
  }
  private set token(token: string) {
    token = token || '';
    if (token === '') {
      localStorage.removeItem(this.TOKEN_STORAGE_KEY);
    } else {
      localStorage.setItem(this.TOKEN_STORAGE_KEY, token);
    }

    this._token = token;
  }

  private getUserFromToken(token: string): User {
    if (token) {
      let payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload) as User;
    } else {
      return null;
    }
  }

  private apiRequest(
    route: string,
    method: 'get'|'post' = 'get',
    authenticatedLogin = false,
    authPayload?: AuthPayload
  ): Observable<any> {
    let ops = {};
    let base: Observable<any>;
    const URL = 'api://users/' + route;

    // 1. Prepare options object (empty if not needed)
    if (authenticatedLogin) {
      ops = {
        headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
      };
    }

    // 2. Select good function from `HttpClient` instance
    switch (method) {
      case 'get':
        base = this.http.get(URL, ops);
        break;
      case 'post':
        base = this.http.post(URL, authPayload, ops);
        break;
      default:
        return observableThrowError('Invalid http method used for API call');
    }

    // 3. return the needed `Observable`\
    return base.pipe(
      tap((data: TokenResponse) => {
        if (data.token) {
          this.token = data.token;
        }
      })
    );
  }
}
