import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class YelpService {
  private _apiUrl = environment.apiUrl;

  constructor(private _httpClient: HttpClient, public snackBar: MatSnackBar) {}

  searchYelpPlaces(location: string, limit: string = '6', offset: string = '0') {
    const params = {
      terms: 'bar',
      location,
      limit,
      offset,
    };

    return this._httpClient.get(`${this._apiUrl}/search`, { params })
      .map(this.extractData)
      .catch(this.handleError.bind(this));
  }

  /**
   * Return data as JSON
   *
   * @param Response res an Observable
   *
   * @return Object containing data from Observable
   */
  extractData(res) {
    const { data } = res;
    return data || [];
  }

  /**
   * Handle errors
   *
   * @param Response http error
   *
   * @return ErrorObservable
   */
  handleError(error: Response | any) {
    let errMsg: string;
    let message: string;

    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      message = body.message;

      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
      message = errMsg;
    }

    this.snackBar.open('something went wrong', 'error', {
      duration: 3000,
    });

    return Observable.throw(errMsg);
  }
}
