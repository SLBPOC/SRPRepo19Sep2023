import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AlgorithmsAndMitigationsService {

  private controllersSelectOptions = '../../../../assets/json/controllers.json';
  private tagSelectOptions = '../../../../assets/json/tags.json';
  private tagDetails = '../../../../assets/json/tag-data.json';
  private algoLineChartJson = '../../../../assets/json/algo-line-chart.json';
  private applyTagUrl = 'http://10.17.12.1:9090/api/v1/applyTags';
  private saveTagsUrl = 'http://10.17.12.1:9090/api/v1/saveTags';
  private refreshTagsJson = 'http://10.17.12.1:9090/api/v1/refreshTags';
  private networkTagsJson = 'http://10.17.12.1:9090/api/v1/networkTags';
  private syncTagsJson = 'http://10.17.12.1:9090/api/v1/syncTags';


  constructor(private http: HttpClient) { }

  getControllerSelectOptionsData(): Observable<any>{
    return this.http.get(this.controllersSelectOptions);
  }

  getTagSelectOptions(): Observable<any>{
    return this.http.get(this.tagSelectOptions);
  }

  getTagsData(): Observable<any>{
    return this.http.get(this.tagDetails);
  }

  applyTags(payload: any): Observable<any> {
    return this.http.post(this.applyTagUrl, payload, {
        headers: {
        }
    })
  }

  saveTags(payload: any): Observable<any> {
    return this.http.post(this.saveTagsUrl, payload, {
        headers: {
        }
    })
  }

  refreshTags(payload: any): Observable<any> {
    return this.http.post(this.refreshTagsJson, payload, {
        headers: {
        }
    })
  }
  
  networkTags(payload: any): Observable<any> {
    return this.http.post(this.networkTagsJson, payload, {
        headers: {
        }
    })
  }

  syncTags(payload: any): Observable<any> {
    return this.http.post(this.syncTagsJson, payload, {
        headers: {
        }
    })
  }
  getAlgorithmsAndMitigationsChartData(): Observable<any> {
    return this.http.get(this.algoLineChartJson)
  }
  
}
