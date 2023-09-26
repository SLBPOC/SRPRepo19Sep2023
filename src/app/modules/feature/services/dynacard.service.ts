import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, map } from 'rxjs';
import { CardDetailsModel, DynacardModel2, FramesDynameter, DynaCardDetailsModel } from '../model/dyna-card.model';
import { environment } from '@environments/environment';


@Injectable()
export class DynacardService {

  baseUrl: string = environment.srp_microservice_url;

  listOfTime: string = "Dynacard/GetDynacardTimeRange";

  detailsForATime = "dynameter/timeframes/";

  selectedTime: Subject<{ selected: any, addedOrRemoved }> = new Subject();

  selectedTimeInGraph = new Subject<string>();

  selectedClassification: Subject<{ startDate: string, endDate: string, classfication: string }> = new Subject();

  constructor(private client: HttpClient) { }

  getListOfTime(classfication: string, startDate: string, endDate: string): Observable<CardDetailsModel[]> {
    var url = this.baseUrl + `dynameter/classfications/${classfication}/timeframes/from/${startDate}/to/${endDate}`;
    return this.client.get<CardDetailsModel[]>(url);
  }

  getListOfCategory(classfication: string, startDate: string, endDate: string): Observable<DynaCardDetailsModel[]> {
    var url = this.baseUrl + `dynameter/dynacards/${classfication}/timeframes/from/${startDate}/to/${endDate}`;
    return this.client.get<DynaCardDetailsModel[]>(url);
  }

  getDynaCardDetailsForATime(time: string): Observable<DynacardModel2[]> {
    var url = this.baseUrl + this.detailsForATime + time;
    return this.client.get<DynacardModel2[]>(url);
  }

  getDetailsAboutTime(time: string): Observable<CardDetailsModel> {
    var url = '../../../../assets/json/card-details-dyncard.json';
    return this.client.get<CardDetailsModel[]>(url).pipe(
      map<CardDetailsModel[], CardDetailsModel>(x => x.find(y => {console.log((new Date(y.id)).toISOString().replace(".000Z",""),time);return (new Date(y.id)).toISOString().replace(".000Z","") == time}))
    )
  }
}
