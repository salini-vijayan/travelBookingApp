import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _userIsAuthenticated: boolean = false;

  // this getter function is to simply wrap the variable
  //  so that we can't set this directly from outside
  // to avoid accidental overwrite from any other part of the page
  // instead use logib or logout method
  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  constructor() {}

  login() {
    this._userIsAuthenticated = true;
  }

  logout() {
    this._userIsAuthenticated = false;
  }
}
