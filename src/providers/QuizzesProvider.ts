import { injectable } from 'inversify';

import axios, { AxiosPromise } from 'axios';

import IocContainer from '../container/IocContainer';
import SERVICES     from '../services/SERVICES';

import Quiz from '../interfaces/Quiz';
import Auth from '../interfaces/Auth';

@injectable()
export default class QuizzesProvider implements Quiz {

  http;
  path = '/quizzes/';
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
  public async getQuizzes() {
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
  public async getQuiz(quiz) {
    return await this.http.get(this.path + quiz, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.auth.token(),
      },
    });
  }
}
