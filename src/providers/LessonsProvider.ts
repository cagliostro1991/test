import { injectable } from 'inversify';

import axios, { AxiosPromise } from 'axios';

import IocContainer from '../container/IocContainer';
import SERVICES     from '../services/SERVICES';

import Lesson from '../interfaces/Lesson';
import Auth from '../interfaces/Auth';

@injectable()
export default class LessonsProvider implements Lesson {

  http;
  path = '/lessons/';
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
  public async getLessons() {
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
  public async getLesson(lesson) {
    return await this.http.get(this.path + lesson, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.auth.token(),
      },
    });
  }
}
