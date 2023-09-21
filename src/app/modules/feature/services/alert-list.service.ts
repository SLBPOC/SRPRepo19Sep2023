import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AlertList } from '../model/alert-list';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { EventList } from '../model/event-list';

const alertsData = '../../../../assets/json/alerts-data.json';

@Injectable({
  providedIn: 'root',
})
export class AlertListService {
  baseUrl: string = environment.srp_microservice_url;
  _apiUrl: string = 'https://localhost:52906/';

  constructor(private http: HttpClient) {}

  // getWellAlerts(): Observable<AlertList[]> {
  //   return this.http.get<AlertList[]>(alertsData);
  // }

  getWellAlerts(): Observable<any> {
    // return this.http.get<any>(this.apiUrl + `Well/GetWellInfoById/${wellId}`, this.httpOptions);
    return this.http.get<Observable<AlertList[]>>(
      `${this.baseUrl}Alerts/GetAllWellList`
    );
  }

  getAlertsByAlertStatus(alertStatus: string): Observable<any> {
    // return this.http.get<any>(this.apiUrl + `Well/GetWellInfoById/${wellId}`, this.httpOptions);
    return this.http.get<any>(
      `${this.baseUrl}Alerts/GetWellAlertsByAlertStatus?AlertStatus=${alertStatus}`
    );
  }

  getAlertListFilters(payload: any): Observable<any> {
    const url = `${this.baseUrl}Alerts/Get`;
    return this.http.post(url, payload, {
      headers: {},
    });
  }

  getAlertList(payload: any): Observable<any> {
    return this.http.post<AlertList[]>(`${this.baseUrl}Alerts/Get`,payload);
  }

  getSnoozeByWellName(wellName: string) {
    return this.http.post<any>(`${this.baseUrl}Alerts/GetSnoozbyWells?WellName=${wellName}`,wellName);
  }

  getDefaultAlertCategory(payload?: any): Observable<any> {
    return this.http.post<AlertList[]>(`${this.baseUrl}Alerts/GetDefaultValues`,payload);
  }

  getDefaultEventCategory(payload?: any): Observable<any> {
    return this.http.post<EventList[]>(this.baseUrl + 'api/Event/Get', payload);
  }

  clearAlert(id: number, comments: string, payload?: any): Observable<any> {
    return this.http.post<AlertList[]>(`${this.baseUrl}Alerts/ClearAlert?alertId=${id}&comment=${comments}`,payload);
  }

  snoozeBy(id: number, time: number, payload?: any): Observable<any> {
    return this.http.post<AlertList[]>(`${this.baseUrl}Alerts/SnoozeBy?alertId=${id}&snoozeBy=${time}`,payload);
  }
}
