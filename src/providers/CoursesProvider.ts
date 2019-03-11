import { injectable } from 'inversify';

import axios, { AxiosPromise } from 'axios';

import IocContainer from '../container/IocContainer';
import SERVICES     from '../services/SERVICES';

import Course from '../interfaces/Course';
import Auth from '../interfaces/Auth';

@injectable()
export default class CoursesProvider implements Course {

  http;
  path = '/courses/';
  auth = IocContainer.get<Auth>(SERVICES.AUTH);

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
  public async getCourses() {
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
  public async getCours(cours) {
    return await this.http.get(this.path + cours, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.auth.token(),
      },
    });
  }
}
