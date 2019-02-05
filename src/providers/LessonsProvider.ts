import { injectable } from 'inversify';

import axios, { AxiosPromise } from 'axios';

import Lesson from '../interfaces/Lesson';

@injectable()
export default class LessonsProvider implements Lesson {

  http;
  path = '/lessons/';

  constructor () {
    this.http = axios.create({
      baseURL: process.env.API_URL,
    });
  }

  /**
   * @returns {AxiosPromise<any>}
   */
  public async getLessons() {
    return await this.http.get(this.path);
  }

  /**
   * @returns {AxiosPromise<any>}
   */
  public async getLesson(lesson) {
    return await this.http.get(this.path + lesson);
  }
}
