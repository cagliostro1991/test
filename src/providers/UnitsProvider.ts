import { injectable } from 'inversify';

import axios, { AxiosPromise } from 'axios';

import Unit from '../interfaces/Unit';

@injectable()
export default class UnitsProvider implements Unit {

  http;
  path = '/units/';

  constructor () {
    this.http = axios.create({
      baseURL: process.env.API_URL,
    });
  }

  /**
   * @returns {AxiosPromise<any>}
   */
  public async getUnits() {
    return await this.http.get(this.path);
  }

  /**
   * @returns {AxiosPromise<any>}
   */
  public async getUnit(unit) {
    return await this.http.get(this.path + unit);
  }
}
