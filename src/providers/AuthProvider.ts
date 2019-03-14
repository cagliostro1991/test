import { injectable } from 'inversify';

import axios, { AxiosPromise } from 'axios';

import Auth from '../interfaces/Auth';

@injectable()
export default class AuthProvider implements Auth {

  http;

  constructor () {
    this.http = axios.create({
      baseURL: process.env.API_URL,
      headers: {
        Accept: 'application/json',
      },
    });
  }

  /**
   * @returns {AxiosPromise<any>}
   */
  public async login(email, password) {
    return await this.http.post('/login/', {
      email:    email,
      password: password,
    });
  }

  public logout() {
    localStorage.removeItem('token');
    window.location.href = process.env.PATH_HOME;
  }

  public authenticated(token) {
    localStorage.setItem('token', token);
  }

  public isAuthenticated() {
    return localStorage.getItem('token') ? true : false;
  }

  public token() {
    return localStorage.getItem('token');
  }
}
