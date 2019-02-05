import { injectable } from 'inversify';

import axios, { AxiosPromise } from 'axios';

import Course from '../interfaces/Course';

@injectable()
export default class CoursesProvider implements Course {

  http;
  path = '/courses/';

  constructor () {
    this.http = axios.create({
      baseURL: process.env.API_URL,
    });
  }

  /**
   * @returns {AxiosPromise<any>}
   */
  public async getCourses() {
    return await this.http.get(this.path);
  }

  /**
   * @returns {AxiosPromise<any>}
   */
  public async getCours(cours) {
    return await this.http.get(this.path + cours);
  }
}
