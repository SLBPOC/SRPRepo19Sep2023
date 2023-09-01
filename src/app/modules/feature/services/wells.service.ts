import { Injectable } from '@angular/core';
//import { WellName } from '../model/wellname';
//import { WellModel } from '../model/wellModel';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { WellModel } from '../model/wellModel';

const wellData = '../../assets/json-data/welllist-data.json';

@Injectable({
  providedIn: 'root'
})
export class WellsService {

  private apiUrl: string = "http://localhost:5000/api/";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  wellListData = '../../../../assets/json/well-list-by-filters.json'
  constructor(private http: HttpClient) { }


  getWellDetails(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + "well", this.httpOptions);
  }

  getWellDetailsWithFilters(searchModel: any): Observable<any> {
    // return this.http.post<WellModel[]>(this.apiUrl + "Well/GetWellListByFilters", searchModel, this.httpOptions);          
    return this.http.get(this.wellListData);
  }

  getWellInfoById(wellId: string): Observable<any> {
    // return this.http.get<any>(this.apiUrl + `Well/GetWellInfoById/${wellId}`, this.httpOptions); 
    return this.http.get<any>(this.apiUrl + `Well/GetWellInfoById?WellId=${wellId}`)
  }

}
