import { Component } from '@angular/core';

export interface PeriodicElement {
  position: number;
  checkbox: string;
  cards: string;
  time: string;
  spm: string;
  pf: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1, checkbox: 'Hydrogen', cards: 'Normal', time: '2023-04-1413: 14: 59', spm: 'H', pf: '23%'
  },
  { position: 2, checkbox: 'Hydrogen', cards: 'Pump tagging', time: '2023-04-1413: 14: 59', spm: 'H', pf: '23%' },
  { position: 3, checkbox: 'Hydrogen', cards: 'Pump tagging', time: '2023-04-1413: 14: 59', spm: 'H', pf: '23%' },
  { position: 4, checkbox: 'Hydrogen', cards: 'Discorted', time: '2023-04-1413: 14: 59', spm: 'H', pf: '23%' },
  { position: 5, checkbox: 'Hydrogen', cards: 'Gas interference', time: '2023-04-1413: 14: 59', spm: 'H', pf: '23%' },
  { position: 6, checkbox: 'Hydrogen', cards: 'Gas interference', time: '2023-04-1413: 14: 59', spm: 'H', pf: '23%' },
  { position: 7, checkbox: 'Hydrogen', cards: 'Normal', time: '2023-04-1413: 14: 59', spm: 'H', pf: '23%' },
  { position: 8, checkbox: 'Hydrogen', cards: 'Fluid Pound', time: '2023-04-1413: 14: 59', spm: 'H', pf: '23%' },
  { position: 9, checkbox: 'Hydrogen', cards: 'Flatlining', time: '2023-04-1413: 14: 59', spm: 'H', pf: '23%' },
  { position: 10, checkbox: 'Hydrogen', cards: 'Fluid Pound', time: '2023-04-1413: 14: 59', spm: 'H', pf: '23%' },
  { position: 11, checkbox: 'Hydrogen', cards: 'Fluid Pound', time: '2023-04-1413: 14: 59', spm: 'H', pf: '23%' },
  { position: 12, checkbox: 'Hydrogen', cards: 'Fluid Pound', time: '2023-04-1413: 14: 59', spm: 'H', pf: '23%' },
  { position: 13, checkbox: 'Hydrogen', cards: 'Fluid Pound', time: '2023-04-1413: 14: 59', spm: 'H', pf: '23%' },
  { position: 14, checkbox: 'Hydrogen', cards: 'Fluid Pound', time: '2023-04-1413: 14: 59', spm: 'H', pf: '23%' },
  { position: 15, checkbox: 'Hydrogen', cards: 'Fluid Pound', time: '2023-04-1413: 14: 59', spm: 'H', pf: '23%' },
  { position: 16, checkbox: 'Hydrogen', cards: 'Fluid Pound', time: '2023-04-1413: 14: 59', spm: 'H', pf: '23%' },
  { position: 17, checkbox: 'Hydrogen', cards: 'Fluid Pound', time: '2023-04-1413: 14: 59', spm: 'H', pf: '23%' },
  { position: 18, checkbox: 'Hydrogen', cards: 'Fluid Pound', time: '2023-04-1413: 14: 59', spm: 'H', pf: '23%' }

];
export interface PeriodicElement2 {
  wellname: string;
  normal: number;
  pumpTagging: number;
  distorted1: number;
  distorted2: number;
  distorted3: number;
  gasInterference1: number;
  gasInterference2: number;
  gasInterference3: number;



}
const ELEMENT_DATA2: PeriodicElement2[] = [
  {
    wellname: 'Pump Fillage (%)',
    normal: 17.829,
    pumpTagging: 17.829,
    distorted1: 17.829,
    distorted2: 17.829,
    distorted3: 17.829,
    gasInterference1: 17.829,
    gasInterference2: 17.829,
    gasInterference3: 17.829,
  },
  {
    wellname: 'SPM',
    normal: 17.829,
    pumpTagging: 17.829,
    distorted1: 17.829,
    distorted2: 17.829,
    distorted3: 17.829,
    gasInterference1: 17.829,
    gasInterference2: 17.829,
    gasInterference3: 17.829,
  },
  {
    wellname: 'Min. Polished Road Load (Lbs)',
    normal: 17.829,
    pumpTagging: 17.829,
    distorted1: 17.829,
    distorted2: 17.829,
    distorted3: 17.829,
    gasInterference1: 17.829,
    gasInterference2: 17.829,
    gasInterference3: 17.829,
  },
  {
    wellname: 'Pick Polished Rod Load (Lbs)',
    normal: 17.829,
    pumpTagging: 17.829,
    distorted1: 17.829,
    distorted2: 17.829,
    distorted3: 17.829,
    gasInterference1: 17.829,
    gasInterference2: 17.829,
    gasInterference3: 17.829,
  },
  {
    wellname: 'Surface Stroke Length (In)',
    normal: 17.829,
    pumpTagging: 17.829,
    distorted1: 17.829,
    distorted2: 17.829,
    distorted3: 17.829,
    gasInterference1: 17.829,
    gasInterference2: 17.829,
    gasInterference3: 17.829,
  },
  {
    wellname: 'Downwhole Stroke',
    normal: 17.829,
    pumpTagging: 17.829,
    distorted1: 17.829,
    distorted2: 17.829,
    distorted3: 17.829,
    gasInterference1: 17.829,
    gasInterference2: 17.829,
    gasInterference3: 17.829,
  },
  {
    wellname: 'Total Fluid (in)',
    normal: 17.829,
    pumpTagging: 17.829,
    distorted1: 17.829,
    distorted2: 17.829,
    distorted3: 17.829,
    gasInterference1: 17.829,
    gasInterference2: 17.829,
    gasInterference3: 17.829,
  },
]

export interface PeriodicElement1 {
  position1: number;
  checkbox1: string;
  pinicon: string;
  Time: string;
  primary: number;
  secondary: string;
  SPM: string;
  PF: string;




}

const ELEMENT_DATA1: PeriodicElement1[] = [

  { position1: 1, checkbox1: '', pinicon: '', Time: '2023-04-14,13:14:59', primary: 1.0079, secondary: 'Fluid Pound 60%', SPM: 'geurgu', PF: '77' },
  { position1: 2, checkbox1: '', pinicon: '', Time: '2023-04-14,13:14:59', primary: 1.0079, secondary: 'Gas interference 60%', SPM: 'qejrnj31r', PF: '11' },
  { position1: 3, checkbox1: '', pinicon: '', Time: '2023-04-14,13:14:59', primary: 1.0079, secondary: 'Distorted 60%', SPM: 'fbjrb', PF: '21' },
  { position1: 4, checkbox1: '', pinicon: '', Time: '2023-04-14,13:14:59', primary: 1.0079, secondary: 'Pump tagging 60%', SPM: 'bejrb', PF: '31' },
  { position1: 5, checkbox1: '', pinicon: '', Time: '2023-04-14,13:14:59', primary: 1.0079, secondary: 'Fluid Pound 60%', SPM: 'rbj31br', PF: '61' },
  { position1: 6, checkbox1: '', pinicon: '', Time: '2023-04-14,13:14:59', primary: 1.0079, secondary: 'Fluid Pound 60%', SPM: 'nrk`3nr', PF: '51' },
  { position1: 7, checkbox1: '', pinicon: '', Time: '2023-04-14,13:14:59', primary: 1.0079, secondary: 'Normal 60%', SPM: 'nrk`3nr', PF: '71' },
  { position1: 7, checkbox1: '', pinicon: '', Time: '2023-04-14,13:14:59', primary: 1.0079, secondary: 'Normal 60%', SPM: 'nrk`3nr', PF: '71' }
];

@Component({
  selector: 'app-ui-dynacard-info',
  templateUrl: './ui-dynacard-info.component.html',
  styleUrls: ['./ui-dynacard-info.component.scss']
})

export class UiDynacardInfoComponent {
  oncheckboxClick: boolean = false;
  displayedColumns: string[] = ['position', 'checkbox', 'cards', 'time', 'spm', 'pf'];
  dataSource = ELEMENT_DATA;

  displayedColumns1: string[] = ['position1', 'checkbox1', 'pinicon', 'Time', 'primary', 'secondary', 'SPM', 'PF'];
  dataSource1 = ELEMENT_DATA1;


  displayedColumns2 = ['wellname', 'normal', 'pumpTagging', 'distorted1', 'distorted2', 'distorted3', 'gasInterference1', 'gasInterference2', 'gasInterference3'];
  dataSource2 = ELEMENT_DATA2;
  // searchObjC: any;
  // userSearchChange(obj: any) {
  //   this.searchObjC = obj;
  // }
}
