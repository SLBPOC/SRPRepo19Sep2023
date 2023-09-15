import { Component } from '@angular/core';

@Component({
  selector: 'app-well-tree-list',
  templateUrl: './well-tree-list.component.html',
  styleUrls: ['./well-tree-list.component.scss']
})
export class WellTreeListComponent {
  searchObjC:any;
  userSearchChange(obj:any){
    this.searchObjC = obj;
  }


}
