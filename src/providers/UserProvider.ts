import { injectable } from 'inversify';

import axios, { AxiosPromise } from 'axios';

import IocContainer from '../container/IocContainer';
import SERVICES     from '../services/SERVICES';

import User from '../interfaces/User';
import Auth from '../interfaces/Auth';

@injectable()
export default class UserProvider implements User {

  http;
  path = '/user/';
  auth = IocContainer.get<Auth>(SERVICES.AUTH);

  constructor () {
    this.http = axios.create({
      baseURL: process.env.API_URL,
    });
  }

  /**
   * @returns {AxiosPromise<any>}
   */
  public async getUser() {
    return await this.http.get(this.path, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.auth.token(),
      },
    });
  }

  /**
   * @returns {AxiosPromise<any>}
   */
  public async setUser(user) {
    return await this.http.post(this.path, {
      name:      (user.name) ? user.name : null,
      last_name: (user.last_name) ? user.last_name : null,
      phone:     (user.phone) ? user.phone : null,
      email:     (user.email) ? user.email : null,
      gender:    (user.gender) ? user.gender : null,
      birthday:  (user.birthday) ? user.birthday : null,
      address:   (user.address) ? user.address : null,
      city:      (user.city) ? user.city : null,
      country:   (user.country) ? user.country : null,
      state:     (user.state) ? user.state : null,
      zip:       (user.zip) ? user.zip : null,
    },
      {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + this.auth.token(),
        },
      });
  }

  /**
   * @returns {AxiosPromise<any>}
   */
  public async setUserPass(pass) {
    return await this.http.post('/update-password/', {
      password: pass,
    },{
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.auth.token(),
      },
    });
  }
}
