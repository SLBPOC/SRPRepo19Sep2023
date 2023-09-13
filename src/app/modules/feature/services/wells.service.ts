import { Injectable } from '@angular/core';
//import { WellName } from '../model/wellname';
//import { WellModel } from '../model/wellModel';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { WellModel, WellModelResult } from '../model/wellModel';
import { Subject } from 'rxjs';
import { environment } from '@environments/environment';

const wellData = '../../assets/json-data/welllist-data.json';

@Injectable({
  providedIn: 'root'
})
export class WellsService {
  sub = new Subject()
  private apiUrl: string = environment.srp_microservice_url;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  wellListData = '../../../../assets/json/well-list-by-filters.json'
  wellListFilterSortDropdowns = '../../../../assets/json/well-list-filter-sort-dropdowns.json'

  constructor(private http: HttpClient) { }


  getWellDetails(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + "well", this.httpOptions);
  }

  getWellDetailsWithFilters(searchModel: any): Observable<any> {
    //return this.http.get(this.wellListData);
    return this.http.post<any[]>(this.apiUrl + "Well/GetWellListByFilters", searchModel, this.httpOptions);
  }

  GetWellFilterDefaultValues(): Observable<any> {
    return this.http.post<any[]>(this.apiUrl + "Well/GetWellFilterDefaulValues", this.httpOptions);  
  }

  getWellInfoById(wellId: string): Observable<any> {
    // return this.http.get<any>(this.apiUrl + `Well/GetWellInfoById/${wellId}`, this.httpOptions); 
    return this.http.get<any>(this.apiUrl + `Well/GetWellInfoById?WellId=${wellId}`)
  }

  getWellListFilterSortDropdowns(): Observable<any> {
    return this.http.get(this.wellListFilterSortDropdowns);
  }
}
