
import AuthPayload from './models/authPayload';
import { User, TokenResponse } from './models/user';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  throwError as observableThrowError,
  Observable
} from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class UserService {
  /**
   * JWT token of the current user (if any)
   *
   * @private
   * @type {string}
   * @memberof UserService
   */
  private token: string;

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
    localStorage.removeItem('api.user.token');

    this.router.navigateByUrl('/');
  }

  /**
   * Returns the `User` currently logged in or null if none
   *
   * @returns {User} THe currently logged in `User`
   * @memberof UserService
   */
  public getCurrentUser(): User {
    const token = this.getToken();
    let payload: string;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  /**
   * Déternmine si il y a actuellement un User de connecté au nvieau de l'application
   *
   * @returns Vrai si un User est connecté, faux sinon ou si son token a expiré
   */
  public isLoggedIn(): boolean {
    const user = this.getCurrentUser();

    return user && user.exp > Date.now() / 1000;
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
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.username === user.username) {
          this.logout();
        }
      })
    );
  }

  /**
   * saves the token into localStorage
   *
   * @private
   * @param {string} token The token to save
   * @memberof UserService
   */
  private saveToken(token: string): void {
    localStorage.setItem('api.user.token', token);
    this.token = token;
  }

  /**
   * Gets the current user's token from memory or from localStorage
   *
   * @private
   * @returns {string} The JWT token associated with the durrent user
   * @memberof UserService
   */
  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('api.user.token');
    }

    return this.token;
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
        headers: new HttpHeaders({ Authorization: `Bearer ${this.getToken()}` })
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
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }

        return data;
      })
    );
  }
}
