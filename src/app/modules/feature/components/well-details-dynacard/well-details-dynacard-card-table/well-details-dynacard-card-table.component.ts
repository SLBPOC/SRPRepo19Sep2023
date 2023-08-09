
import {SelectionModel} from '@angular/cdk/collections';
import {Component,ViewChild} from '@angular/core';
// import {MatTableDataSource} from '@angular/material';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

export interface PeriodicElement {
  card: string ;
  time: string;
  minimunpolishedrodload:number;
  peakpolishedrod:string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {card: 'pumptagging', time: "2020-04-14 13:14:59", minimunpolishedrodload: 1.0079, peakpolishedrod: '30,310 lbs'},
  {card: 'pumptagging', time: "2020-04-14 13:14:59", minimunpolishedrodload: 4.0026, peakpolishedrod: '30,310 lbs'},
  {card: 'pumptagging', time: "2020-04-14 13:14:59", minimunpolishedrodload: 6.941, peakpolishedrod:'30,310 lbs'},
  {card: 'pumptagging', time: "2020-04-14 13:14:59", minimunpolishedrodload: 9.0122, peakpolishedrod: '30,310 lbs'},
  {card: 'pumptagging', time: "2020-04-14 13:14:59", minimunpolishedrodload: 10.811, peakpolishedrod: '30,310 lbs'},
  

  
];
@Component({
  selector: 'app-well-details-dynacard-card-table',
  templateUrl: './well-details-dynacard-card-table.component.html',
  styleUrls: ['./well-details-dynacard-card-table.component.scss']
})
export class WellDetailsDynacardCardTableComponent {
  data: any[] = [];
  displayedColumns: string[] = ['select', 'card', 'time', 'minimunpolishedrodload', 'peakpolishedrod'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  isChecked: boolean = false;

  constructor() {}

 ngOnInit() {
    
  }




  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach((row: PeriodicElement)=> this.selection.select(row));
  }

  


}
