import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventList } from '../model/event-list';
import { Observable, map, tap } from 'rxjs';
import { SLBSearchParams, SortOptions } from 'src/app/models/slb-params';
import { environment } from '@environments/environment';
@Injectable({
  providedIn: 'root',
})
export class EventListService {
  private apiUrl: string = environment.srp_microservice_url;
  _apiUrl: string = 'https://localhost:52906/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  // getWellAlerts(): Observable<AlertList[]> {
  //   return this.http.get<AlertList[]>(alertsData);
  // }

  getWellAlerts(): Observable<any> {
    // return this.http.get<any>(this.apiUrl + `Well/GetWellInfoById/${wellId}`, this.httpOptions);
    return this.http.get<Observable<EventList[]>>(
      `${this._apiUrl}Alerts/GetAllWellList`
    );
  }

  getAlertsByAlertStatus(alertStatus: string): Observable<any> {
    // return this.http.get<any>(this.apiUrl + `Well/GetWellInfoById/${wellId}`, this.httpOptions);
    return this.http.get<any>(
      `${this._apiUrl}Alerts/GetWellAlertsByAlertStatus?AlertStatus=${alertStatus}`
    );
  }

  getAlertListFilters(payload: any): Observable<any> {
    const url = `${this._apiUrl}Alerts/GetAlertList`;
    return this.http.post(url, payload, {
      headers: {},
    });
  }

  getAlertList(SearchModel: any): Observable<any> {
    return this.http.post<EventList[]>(
      this._apiUrl + 'api/Event/Get',
      SearchModel
    );
  }

  getDefaultAlertCategory(payload?: any): Observable<any> {
    return this.http.post<EventList[]>(
      this._apiUrl + 'api/Alerts/GetDefaultValues',
      payload
    );
  }

  clearAlert(id: number, comments: string, payload?: any): Observable<any> {
    return this.http.post<EventList[]>(
      this._apiUrl + `api/Alerts/ClearAlert?alertId=${id}&comment=${comments}`,
      payload
    );
  }

  snoozeBy(id: number, time: number, payload?: any): Observable<any> {
    return this.http.post<EventList[]>(
      this._apiUrl + `api/Alerts/SnoozeBy?alertId=${id}&snoozeBy=${time}`,
      payload
    );
  }
}
