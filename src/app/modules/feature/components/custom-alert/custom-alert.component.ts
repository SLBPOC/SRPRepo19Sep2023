import { Component, EventEmitter, Input, NgZone, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { customAlert } from 'src/app/modules/feature/model/customAlert';
import { CustomAlertService } from 'src/app/modules/feature/services/customAlert.service';
import { ThemePalette } from '@angular/material/core';
import { DateRange } from '@angular/material/datepicker';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-custom-alert',
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.scss']
})
export class CustomAlertComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() selectedRangeValue!: DateRange<Date>;
  @Output() selectedRangeValueChange = new EventEmitter<DateRange<Date>>();


  // public dateControl = new FormControl(new Date(2021,9,4,5,6,7));
  //     public dateControlMinMax = new FormControl(new Date());
      customAlertForm = this.fb.group({
      CustomAlertName: ['', [Validators.required]],
      wellName: ['', [Validators.required]],
      NotificationType: ['', [Validators.required]],
      Priority: ['', [Validators.required]],
      Category: ['', [Validators.required]],
      Operator: ['', [Validators.required]],
      Value: ['', [Validators.required]],
      actualValue: ['', [Validators.required]],
      IsActive: ['', [Validators.required]],
      dateRange: ['', [Validators.required]]       
    });

  customTime: any;
  date = new Date();
  public disabled = false;
  public showSpinners = true;
  public showSeconds = true;
  public touchUi = false;
  public enableMeridian = false; 
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';
  startDate:any;
  endDate:any;
  disableSelect:any;
  selected!: Date;
  isNumeric:boolean = false;
  selectionModel!:any;
  ActualValue!:any;
  submitted = false;
  dateFlag=false;
  valueFlag=false;
  // Grid column variables
  alertData!: customAlert[];
    public displayedColumns = ['CustomAlertName', 'WellName', 'IsActive'];
    dataSource:any;

  // Filter variable
  well:any[];
  notification:any;
  priority:any;
  category:any;
  operator:any;
  value:any;
  isActive:boolean=true;
 
  //Pagination variables
  maxPageSize: number = Math.max(...environment.pageSizeOption);
  pageSizeOption:any;
  pageSize: number = 10;
  pageNumber = 1;
  currentPage = 0;
  totalCount = 0;
  model: any = {}   
  sortDirection: string = "";
  sortColumn: string = "";  
  @ViewChild(MatSort) sort!: MatSort; 

  constructor(private fb: FormBuilder,private CustomAlertService:CustomAlertService ,private dialogRef: MatDialogRef<CustomAlertComponent>) {
     this.notification=environment.customAlertNotification;
     this.priority=environment.customAlertPriority;
     this.category=environment.customAlertCategory;
     this.operator=environment.customAlertOperator;
     this.value=environment.customAlertValue;
  }

 
  ngOnInit() {
      this.getAlertDetails();
  }
      

  selectedChange(m: any) {
      if (!this.selectedRangeValue?.start || this.selectedRangeValue?.end) {
        this.selectedRangeValue = new DateRange<Date>(m, null);
      } else {
        const start = this.selectedRangeValue.start;
        const end = m;
        if (end < start) {
          this.selectedRangeValue = new DateRange<Date>(end, start);
        } else {
          this.selectedRangeValue = new DateRange<Date>(start, end);
        }
      }
      this.selectedRangeValueChange.emit(this.selectedRangeValue);
      this.dateFlag = false;
  }

    //Create Model for search
  createModel(this: any) {
    this.model.pageSize = this.pageSize;
    this.model.pageNumber = this.pageNumber;
    this.model.sortColumn = this.sortColumn ? this.sortColumn : "";
    this.model.sortDirection = this.sortDirection ? this.sortDirection : "";
    return this.model;
  }

  getAlertDetails(){
    this.submitted = false;
    var SearchModel = this.createModel();
      this.CustomAlertService.displayDetails(SearchModel)
        .subscribe(response=>{          
          this.alertData = response.customAlertDto;
          this.well=response.wellFilterListDetails;
          this.totalCount=response.countDetails.totalCount;
         
          this.dataSource = new MatTableDataSource<customAlert>(this.alertData);
          this.dataSource.sort = this.sort;
          
        setTimeout(() => {
          this.loadPageOptions();    
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = response.countDetails.totalCount;          
        }); 
      })
    }

    public loadPageOptions()
    {
      this.pageSizeOption=[10,20,30];
      if(!this.pageSizeOption.includes(this.totalCount))
          {
            if(this.totalCount>this.maxPageSize)
            {
              this.pageSizeOption.push(this.totalCount);
            }
          }
    }
    public onSortChanged(e: any) {
      this.pageNumber = this.pageNumber;
      this.pageSize = this.pageSize;
      this.sortDirection = this.sort.direction;
      this.sortColumn = (typeof this.sort.active !== "undefined") ? this.sort.active : "";
      this.getAlertDetails();
    }

    pageChanged(event: PageEvent) {      
      this.pageSize = event.pageSize;
      this.currentPage = event.pageIndex;
      this.pageNumber = event.pageIndex + 1;
      this.getAlertDetails();
    }

    getSelectedMonth(month: any){
      let m = month + 1;
      return m.toString().padStart(2,'0');
    }
  
    getSelectedDay(day: any){
      return day.toString().padStart(2,'0');
    }
  
    applyDateRangeFilter() {
      let fromDate = this.selectedRangeValue.start;
      let toDate = this.selectedRangeValue.end;
      this.startDate = fromDate?.getFullYear() + '-' + this.getSelectedMonth(fromDate?.getMonth()) + '-' + this.getSelectedDay(fromDate?.getDate());
      this.endDate = toDate?.getFullYear() + '-' + this.getSelectedMonth(toDate?.getMonth()) + '-' + this.getSelectedDay(toDate?.getDate()); 
    }

    onChange()
    {
      if(this.selectionModel == this.value[0])
      {
        this.isNumeric = true;
        this.valueFlag = false;
      }
      else
      {
      this.isNumeric = false;
      this.valueFlag = true;
      }
    }

    onSubmit(){
      if(this.customAlertForm.value!=null)
      {        
        this.submitted = true;
        this.dateFlag = true;
        if(this.isNumeric == true)
        {
          if(this.customAlertForm.value.actualValue=="" || this.customAlertForm.value.actualValue==undefined)
            {
              this.valueFlag = false;
            }
            else
            {
              this.valueFlag = true;
            }
        }
        // else{
        //   this.flag1 = false;
        // }
      let obj:any;
      let timeZone = this.date.toISOString().slice(-4);
      let time = this.date.toTimeString().slice(0,8);
      let customTime = "T" + time + "." + timeZone;
      this.applyDateRangeFilter();
      this.startDate = this.startDate +  customTime;      
      this.endDate = this.endDate +  customTime;
      obj = { 
        wellName:this.customAlertForm.value.wellName,
        customAlertName:this.customAlertForm.value.CustomAlertName,     
        notificationType:this.customAlertForm.value.NotificationType,
        priority:this.customAlertForm.value.Priority,
        category:this.customAlertForm.value.Category,
        operator:this.customAlertForm.value.Operator,
        value:this.customAlertForm.value.Value,
        isActive:this.customAlertForm.value.IsActive,
        actualValue:this.customAlertForm.value.actualValue=="" ? null : this.customAlertForm.value.actualValue,
        startDate:this.startDate,
        endDate:this.endDate
      }
      if(this.valueFlag == true)
      {
        this.CustomAlertService.addCustomAlert(obj).subscribe((res)=>{ 
        if(res!=null)
        {
          alert("Records added successfully");
        }     
          this.getAlertDetails();     
          this.clear();
          this.dateFlag = false;
          this.valueFlag = false;
        });
      }
    }
    this.dateFlag=false;
    this.valueFlag = true;
    }

    editAlert(Id:number)
    {
      
      var GetRecord=this.alertData.filter(a=> a.id==Id)
      if(GetRecord != null)
      {
        this.isActive=GetRecord[0].isActive;
        this.customAlertForm.controls.CustomAlertName.setValue(GetRecord[0].customAlertName);
        this.customAlertForm.controls.wellName.setValue(GetRecord[0].wellName);
        this.customAlertForm.controls.NotificationType.setValue(GetRecord[0].notificationType);
        this.customAlertForm.controls.NotificationType.setValue(GetRecord[0].notificationType);        
        this.customAlertForm.controls.Priority.setValue(GetRecord[0].priority);
        this.customAlertForm.controls.Category.setValue(GetRecord[0].category);
        this.customAlertForm.controls.Operator.setValue(GetRecord[0].operator);
        this.customAlertForm.controls.Value.setValue(GetRecord[0].value);
        this.ActualValue=GetRecord[0].actualValue;
        
        if(this.ActualValue!=null)
        {
          this.isNumeric=true;
        }
        else
        {
          this.isNumeric=false;
        }
        let startDate = GetRecord[0].startDate;
        let sDate = startDate.slice(0,10);
        let endDate = GetRecord[0].endDate;
        let eDate =  endDate.slice(0,10);
        this.selectedRangeValue = new DateRange<Date>(new Date(sDate), new Date(eDate));       
      }
    }

    deleteAlert(id:number)
    {
      this.CustomAlertService.deleteCustomAlert(id).subscribe((res)=>{
        this.getAlertDetails();
      })
    }

    toggle(id:number,event:any){
      let val=event.checked;
      this.CustomAlertService.isActiveCustomAlert(id,val).subscribe((res)=>{        
      })
    }

    clear()
    {
      this.submitted = false;
      this.dateFlag = false;
      this.customAlertForm.get('CustomAlertName')?.reset();
      this.customAlertForm.get('wellName')?.reset();
      this.customAlertForm.get('NotificationType')?.reset();
      this.customAlertForm.get('Priority')?.reset();
      this.customAlertForm.get('Category')?.reset();
      this.customAlertForm.get('Operator')?.reset();
      this.customAlertForm.get('Value')?.reset();
      this.customAlertForm.get('actualValue')?.reset();
      this.selectedRangeValue = new DateRange<Date>(null, null);
    }

    cancel()
    {
      this.clear();
    }

    close(){
      this.dialogRef.close();
    }

}