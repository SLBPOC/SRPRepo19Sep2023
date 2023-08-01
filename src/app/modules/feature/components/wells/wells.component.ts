import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
//import { WellName } from '../model/wellname';
import { WellModel } from '../../model/wellModel'
import { WellsService } from '../../services/wells.service';
import {FormControl} from '@angular/forms';
import { MatSelect } from '@angular/material/select';
interface Food {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-wells',
  templateUrl: './wells.component.html',
  styleUrls: ['./wells.component.scss']
})
export class WellsComponent {

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];

  ///////////////////////////////////////////////
  // toppings = this._formBuilder.group({
  //   EffectiveRunTime: false,
  //   CyclesToday: false,
  //   StructuralLoad: false,
  //   MinMaxLoad: false,
  //   GearboxLoad: false,
  //   RodStress: false
  // });
 dataSource:any =[];
 //wellList!: WellName[];
 WellModel!:WellModel[];
 displayedColumns: string[] = [ 'wellName', 'updatedDateTime','communicationStatus','controllerStatus','avgSPM','AvgSPM','inferredProduction','yesterdayCycle'];
 displayableExtraColumns: {label: string, accessor: string}[] = [];
 extraColumnsCtrl: any = new FormControl('');
 extraColumnsList: {label: string, accessor: string}[] = [
  { label: 'Effective Runtime', accessor: 'effectiveRuntime'}, 
  { label: 'Cycles Today', accessor: 'cycleToday'}, 
  { label: 'Structural Load', accessor: 'structuralLoad'}, 
  { label: 'MinMax Load', accessor: 'minMaxLoad'}, 
  { label: 'Gearbox Load', accessor: 'gearBoxLoad'}, 
  { label: 'Rod Stress', accessor: 'rodStress'}
];
@ViewChild(MatPaginator)
paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
@ViewChild('extraColumns', {static: true}) private extraColumns!: MatSelect;
constructor(  private _liveAnnouncer: LiveAnnouncer, private service: WellsService) { }
ngOnInit(): void {
  // this.service.getWellAlerts().subscribe((response:any) => {
  //   this.wellList = response;
  //   this.dataSource = new MatTableDataSource<WellName>(this.wellList);
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // })

  this.service.getWellDetails().subscribe((response:any) => {
    this.WellModel = response;
    this.dataSource = new MatTableDataSource<WellModel>(this.WellModel);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  })
  
}

search(data: Event) {
  const val = (data.target as HTMLInputElement).value;
  this.dataSource.filter = val;

}
 
// statusChange(event: any){
//   let filterValue;
//   filterValue = event.value.trim(); // Remove whitespace
//   filterValue = event.value.toLowerCase(); // MatTableDataSource defaults to lowercase matches
//   this.dataSource.filter = filterValue;
// }


alertChange(event: any){
  let filterValue;
  filterValue = event.value.trim(); // Remove whitespace
  filterValue = event.value.toLowerCase(); // MatTableDataSource defaults to lowercase matches
  this.dataSource.filter = filterValue;
}

getSelectedValues(): void {
  this.extraColumns.close();
  const selectedColumns: string[] = this.extraColumnsCtrl.value;
  this.displayedColumns = [...this.displayedColumns.filter((column: string) => !this.extraColumnsList.find(({accessor}) => accessor === column)), ...selectedColumns];
  this.displayableExtraColumns = this.extraColumnsList.filter((extraColumn: {label: string, accessor: string}) => selectedColumns.includes(extraColumn.accessor));
}

onChange($event:any){
  // let filteredData = _.filter(this.wellList,(item) =>{
  //   return item.gender.toLowerCase() ==  $event.value.toLowerCase();
  // })
  // this.dataSource = new MatTableDataSource(filteredData);
}
}

