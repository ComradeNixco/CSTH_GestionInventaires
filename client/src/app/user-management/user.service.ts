import { UserManagementModule } from './user-management.module';
import { Injectable } from '@angular/core';
import { HttpClient } from 'selenium-webdriver/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: UserManagementModule
})
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
    private router: Router
  ) { }

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
}
