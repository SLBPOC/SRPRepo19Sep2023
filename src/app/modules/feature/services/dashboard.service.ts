import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  yesterdayCycleCountJson = '../../../../assets/json/yesterday-cycle-count-data.json';

  constructor(private http: HttpClient) { }

  getYesterdayCycleCountData(): Observable<any> |null{
    return this.http.get(this.yesterdayCycleCountJson);
  }
  
}
