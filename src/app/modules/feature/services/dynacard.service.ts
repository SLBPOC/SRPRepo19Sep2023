import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, map } from 'rxjs';
import { CardDetailsModel, DynacardModel2 } from '../model/dyna-card.model';

@Injectable()
export class DynacardService {

  baseUrl: string = "http://localhost:5000/api/";

  listOfTime: string = "Dynacard/GetDynacardTimeRange";

  detailsForATime = "Dynacard/GetByRange?startDate=";

  selectedTime: Subject<{ selected: string, addedOrRemoved }> = new Subject();

  selectedTimeInGraph = new Subject<string>();

  selectedClassification: Subject<number> = new Subject();

  constructor(private client: HttpClient) { }

  getListOfTime(): Observable<string[]> {
    var url = this.baseUrl + this.listOfTime;
    return this.client.get<string[]>(url);
  }

  getDynaCardDetailsForATime(time: string): Observable<DynacardModel2[]> {
    var url = this.baseUrl + this.detailsForATime + time;
    return this.client.get<DynacardModel2[]>(url);
  }

  getDetailsAboutTime(time: string): Observable<CardDetailsModel> {
    var url = '../../../../assets/json/card-details-dyncard.json';
    return this.client.get<CardDetailsModel[]>(url).pipe(map<CardDetailsModel[], CardDetailsModel>(x => x.find(y => y.id == time)))
  }
}
