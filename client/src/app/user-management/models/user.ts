/**
 * Represents the Token html response from the login API route
 *
 * @export
 * @interface TokenResponse
 */
export interface TokenResponse {
  token: string;
}

/**
 * User model, representation of the info contained in the JWT token format returned by the API
 *
 * @export
 * @class User
 */
export class User {
  private _username: string;
  public get username(): string {
    return this._username;
  }
  public set username(v: string) {
    this._username = v;
  }

  private _isActive: boolean;
  public get isActive(): boolean {
    return this._isActive;
  }
  public set isActive(v: boolean) {
    this._isActive = v;
  }

  private _isAdmin: boolean;
  public get isAdmin(): boolean {
    return this._isAdmin;
  }
  public set isAdmin(v: boolean) {
    this._isAdmin = v;
  }

  public get isConnected(): boolean {
    const RET = this.isActive          // To be considered connected, one has to be active
      && this.exp                      // If not connected, exp doesn't get set
      && this.exp > Date.now() / 1000; // Is the token expired?
    return RET;
  }

  /**
   * Expiration date of the token linked with this user, if this instance is the current user (logged-in by the API)
   *
   * @private
   * @type {number}
   * @memberof User
   */
  private _exp: number;
  public get exp(): number {
    return this._exp;
  }
  public set exp(v: number) {
    this._exp = v;
  }
}
