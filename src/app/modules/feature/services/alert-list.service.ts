import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    const url = `http://localhost:5000/api/Alerts/clearAlert`;
    console.log(payload)
    return this.http.post(url, payload, {
      headers: {}
    })
  }

  snoozeBy(payload: any): Observable<any> {
    const url = `http://localhost:5000/api/Alerts/snoozeBy`;
    console.log(payload)
    return this.http.post(url, payload, {
      headers: {}
    })
  }

}
