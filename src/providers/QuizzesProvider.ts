import { injectable } from 'inversify';

import axios, { AxiosPromise } from 'axios';

import Quiz from '../interfaces/Quiz';

@injectable()
export default class QuizzesProvider implements Quiz {

  http;
  path = '/quizzes/';

  constructor () {
    this.http = axios.create({
      baseURL: process.env.API_URL,
    });
  }

  /**
   * @returns {AxiosPromise<any>}
   */
  public async getQuizzes() {
    return await this.http.get(this.path);
  }

  /**
   * @returns {AxiosPromise<any>}
   */
  public async getQuiz(quiz) {
    return await this.http.get(this.path + quiz);
  }
}
