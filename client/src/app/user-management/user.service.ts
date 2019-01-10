
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
  private token$: BehaviorSubject<string>;
  private readonly TOKEN_STORAGE_KEY = 'api.user.token';

  constructor(
    private http: HttpClient,
    private router?: Router
  ) {}

  /**
   * Logs out the current user by erasing from memory and from it's token before 'returning' to the root route
   *
   * @memberof UserService
   */
  public logout(): void {
    this.token = '';
  }

  /**
   * Returns the `User` currently logged in or null if none
   *
   * @returns {User} The currently logged in `User`
   * @memberof UserService
   */
  public getCurrentUser(): Observable<User> {
    return this.token$.pipe(
      map(s => this.getUserFromToken(s))
    );
  }

  /**
   * Déternmine si il y a actuellement un User de connecté au nvieau de l'application
   *
   * @returns Vrai si un User est connecté, faux sinon ou si son token a expiré
   */
  public isLoggedIn(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map(u => u && u.exp > Date.now() / 1000)
    );
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
    return this.token$.getValue();
  }
  private set token(token: string) {
    if (token === '') {
      localStorage.removeItem(this.TOKEN_STORAGE_KEY);
    } else {
      localStorage.setItem(this.TOKEN_STORAGE_KEY, token);
    }
    this.token$.next(token);
  }

  private getUserFromToken(token: string): User {
    let payload: string;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
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
