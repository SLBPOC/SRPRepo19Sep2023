import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, DialogPosition } from "@angular/material/dialog";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  searchObjC:any;
  constructor(public dialog: MatDialog) {}
  userSearchChange(obj:any){
    this.searchObjC = obj;
  }
  openDialog(event: any,title:any) {
    this.dialog.closeAll();
    this.dialog.open(DialogDataExampleDialog,{
      width: '1050px',
      height: '650px',
      
    });
  }
}

@Component({
  selector: "dialog-data-example-dialog",
  templateUrl: "dashboard.dialogbox.html"
})
export class DialogDataExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public Title: "") {}
}
