import { Injectable } from '@angular/core';
//import { WellName } from '../model/wellname';
//import { WellModel } from '../model/wellModel';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'

const wellData = '../../assets/json-data/welllist-data.json';

@Injectable({
  providedIn: 'root'
})
export class WellsService {

  private apiUrl: string="http://localhost:61209/api/";
    httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      };

  constructor(private http: HttpClient) { }

  
  getWellDetails(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + "well", this.httpOptions);          
  }
}
