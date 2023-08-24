import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AlertList } from '../model/alert-list';
import { Observable } from 'rxjs';


const alertsData = '../../../../assets/json/alerts-data.json';

@Injectable({
  providedIn: 'root'
})
export class AlertListService {

  constructor(private http: HttpClient) { }

  // getWellAlerts(): Observable<AlertList[]> {
  //   return this.http.get<AlertList[]>(alertsData);
  // }

  getWellAlerts(): Observable<any> {
    // return this.http.get<any>(this.apiUrl + `Well/GetWellInfoById/${wellId}`, this.httpOptions); 
    return this.http.get<Observable<AlertList[]>> (`http://localhost:5000/api/Alerts/GetAllWellList`)       
  }

  getAlertsByAlertStatus(alertStatus: string): Observable<any> {
    // return this.http.get<any>(this.apiUrl + `Well/GetWellInfoById/${wellId}`, this.httpOptions); 
    return this.http.get<any>  (`http://localhost:5000/api/Alerts/GetWellAlertsByAlertStatus?AlertStatus=${alertStatus}`)       
  }

  getAlertListFilters(payload: any): Observable<any> {
    const url = `http://localhost:5000/api/Alerts/GetAlertList`;
    console.log(payload)
    return this.http.post(url, payload, {
      headers: {}
    })
  }

  clearAlert(payload: any): Observable<any> {
    // let params = new HttpParams()
    // .set('alertId', payload.alertId)
    // .set('comment', payload.comment)
    // let httpOptions = {
    //   params: params
    // }
    const url = `http://localhost:5000/api/Alerts/ClearAlert`;
    console.log(payload)
    return this.http.post(url, null, {
      params: payload,
    })
  }

  snoozeBy(payload: any): Observable<any> {
    const url = `http://localhost:5000/api/Alerts/SnoozeBy`;
    console.log(payload)
    return this.http.post(url, null, {
      params: payload
    })
  }

}
