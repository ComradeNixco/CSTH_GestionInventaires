export interface TokenResponse {
  token: string;
}

export class UserToken {
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
}
