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
  @ViewChild(MatPaginator) Paginator!: MatPaginator;
  @Input() SelectedRangeValue!: DateRange<Date>;
  @Output() SelectedRangeValueChange = new EventEmitter<DateRange<Date>>();


  // public dateControl = new FormControl(new Date(2021,9,4,5,6,7));
  //     public dateControlMinMax = new FormControl(new Date());
      CustomAlertForm = this.fb.group({
        CustomAlertId:[],
      CustomAlertName: ['', [Validators.required]],
      WellName: ['', [Validators.required]],
      NotificationType: ['', [Validators.required]],
      Priority: ['', [Validators.required]],
      Category: ['', [Validators.required]],
      Operator: ['', [Validators.required]],
      Value: ['', [Validators.required]],
      ActualValue: ['', [Validators.required]],
      IsActive: ['', [Validators.required]],
      DateRange: ['', [Validators.required]]       
    });

  //CustomTime: any;
  CustomDate = new Date();
  public Disabled = false;
  public ShowSpinners = true;
  public ShowSeconds = true;
  //public TouchUi = false;
  public EnableMeridian = false; 
  public StepHour = 1;
  public StepMinute = 1;
  public StepSecond = 1;
  public Color: ThemePalette = 'primary';
  StartDate:any;
  EndDate:any;
 // DisableSelect:any;
  //Selected!: Date;
  IsNumeric:boolean = false;
  SelectionModel!:any;
  ActualValue!:any;
  AlertId!:any;
  Submitted = false;
  DateFlag=false;
  ValueFlag=false;
  IsUpdateCondition = false;  
  // Grid column variables
  AlertData!: customAlert[];
    public DisplayedColumns = ['CustomAlertName', 'WellName', 'IsActive'];
    DataSource:any;

  // Filter variable
  Well:any[];
  Notification:any;
  Priority:any;
  Category:any;
  Operator:any;
  Value:any;
  IsActiveValue:boolean=true;
 
  //Pagination variables
  MaxPageSize: number = Math.max(...environment.pageSizeOption);
  PageSizeOption:any;
  PageSize: number = 10;
  PageNumber = 1;
  CurrentPage = 0;
  TotalCount = 0;
  Model: any = {}   
  SortDirection: string = "";
  SortColumn: string = "";  
  @ViewChild(MatSort) sort!: MatSort; 

  constructor(private fb: FormBuilder,private CustomAlertService:CustomAlertService ,private dialogRef: MatDialogRef<CustomAlertComponent>) {
     this.Notification=environment.customAlertNotification;
     this.Priority=environment.customAlertPriority;
     this.Category=environment.customAlertCategory;
     this.Operator=environment.customAlertOperator;
     this.Value=environment.customAlertValue;
  }

 
  ngOnInit() {
      this.getAlertDetails();
  }
      

  selectedChange(m: any) {
      if (!this.SelectedRangeValue?.start || this.SelectedRangeValue?.end) {
        this.SelectedRangeValue = new DateRange<Date>(m, null);
      } else {
        const start = this.SelectedRangeValue.start;
        const end = m;
        if (end < start) {
          this.SelectedRangeValue = new DateRange<Date>(end, start);
        } else {
          this.SelectedRangeValue = new DateRange<Date>(start, end);
        }
      }
      this.SelectedRangeValueChange.emit(this.SelectedRangeValue);
      this.DateFlag = false;
  }

    //Create Model for search
  createModel(this: any) {
    this.Model.PageSize = this.PageSize;
    this.Model.PageNumber = this.PageNumber;
    this.Model.SortColumn = this.SortColumn ? this.SortColumn : "Id";
    this.Model.SortDirection = this.SortDirection ? this.SortDirection : "desc";
    return this.Model;
  }

  getAlertDetails(){
    this.Submitted = false;
    var SearchModel = this.createModel();
      this.CustomAlertService.displayDetails(SearchModel)
        .subscribe(response=>{          
          this.AlertData = response.customAlertDto;
          this.Well=response.wellFilterListDetails;
          this.TotalCount=response.countDetails.totalCount;
         
          this.DataSource = new MatTableDataSource<customAlert>(this.AlertData);
          this.DataSource.sort = this.sort;
          
        setTimeout(() => {
          this.loadPageOptions();    
          this.Paginator.pageIndex = this.CurrentPage;
          this.Paginator.length = response.countDetails.totalCount;          
        }); 
      })
    }

    public loadPageOptions()
    {
      this.PageSizeOption=[10,20,30];
      if(!this.PageSizeOption.includes(this.TotalCount))
          {
            if(this.TotalCount>this.MaxPageSize)
            {
              this.PageSizeOption.push(this.TotalCount);
            }
          }
    }
    public onSortChanged(e: any) {
      this.PageNumber = this.PageNumber;
      this.PageSize = this.PageSize;
      this.SortDirection = this.sort.direction;
      this.SortColumn = (typeof this.sort.active !== "undefined") ? this.sort.active : "";
      this.getAlertDetails();
    }

    pageChanged(event: PageEvent) {      
      this.PageSize = event.pageSize;
      this.CurrentPage = event.pageIndex;
      this.PageNumber = event.pageIndex + 1;
      this.getAlertDetails();
    }

    getSelectedMonth(Month: any){
      let m = Month + 1;
      return m.toString().padStart(2,'0');
    }
  
    getSelectedDay(Day: any){
      return Day.toString().padStart(2,'0');
    }
  
    applyDateRangeFilter() {
      let FromDate = this.SelectedRangeValue.start;
      let ToDate = this.SelectedRangeValue.end;
      this.StartDate = FromDate?.getFullYear() + '-' + this.getSelectedMonth(FromDate?.getMonth()) + '-' + this.getSelectedDay(FromDate?.getDate());
      this.EndDate = ToDate?.getFullYear() + '-' + this.getSelectedMonth(ToDate?.getMonth()) + '-' + this.getSelectedDay(ToDate?.getDate()); 
    }

    onChange()
    {
      if(this.SelectionModel == this.Value[0])
      {
        this.IsNumeric = true;
        this.ValueFlag = false;
      }
      else
      {
      this.IsNumeric = false;
      this.ValueFlag = true;
      }
    }

    customDateTime()
    {
      let TimeZone = this.CustomDate.toISOString().slice(-4);
      let Time = this.CustomDate.toTimeString().slice(0,8);
      let CustomTime = "T" + Time + "." + TimeZone;
      this.applyDateRangeFilter();
      this.StartDate = this.StartDate +  CustomTime;      
      this.EndDate = this.EndDate +  CustomTime;
    }

    onSubmit(){
      if(this.CustomAlertForm.value!=null)
      {        
        this.Submitted = true;
        this.DateFlag = true;
        if(this.IsNumeric == true)
        {
          if(this.CustomAlertForm.value.ActualValue=="" || this.CustomAlertForm.value.ActualValue==undefined)
            {
              this.ValueFlag = false;
            }
            else
            {
              this.ValueFlag = true;
            }
        }
      let Obj:any;
      var Actual=null;
      if(this.CustomAlertForm.value.Value=="Any numerical value")
      {
        Actual=this.CustomAlertForm.value.ActualValue== ""? null : this.CustomAlertForm.value.ActualValue;
        
      }
      this.customDateTime();
      
      Obj = { 
        wellName:this.CustomAlertForm.value.WellName,
        customAlertName:this.CustomAlertForm.value.CustomAlertName,     
        notificationType:this.CustomAlertForm.value.NotificationType,
        priority:this.CustomAlertForm.value.Priority,
        category:this.CustomAlertForm.value.Category,
        operator:this.CustomAlertForm.value.Operator,
        value:this.CustomAlertForm.value.Value,
        isActive:this.CustomAlertForm.value.IsActive,
        actualValue:Actual,
        startDate:this.StartDate,
        endDate:this.EndDate
      }
      if(this.ValueFlag == true)
      {
        this.CustomAlertService.addCustomAlert(Obj).subscribe((res)=>{ 
        if(res!=null)
        {
          alert("Records added successfully");
        }   
          this.SortColumn = "Id"; 
          this.SortDirection = "desc";
          this.PageNumber = 1; 
          this.getAlertDetails();     
          this.clear();
          this.IsNumeric = false;
          this.DateFlag = false;
          this.ValueFlag = false;
        });
      }
    }
    this.DateFlag=false;
    this.ValueFlag = true;
    }

    editAlert(alertId:number)
    {
      this.cloneAlert(alertId);
      this.IsUpdateCondition = true;
    }

    updateAlert()
    {
      let Obj:any;
      this.customDateTime();
      var Actual=null;
      if(this.CustomAlertForm.value.Value=="Any numerical value")
      {
        Actual=this.CustomAlertForm.value.ActualValue== ""? null : this.CustomAlertForm.value.ActualValue;
        
      }
      Obj = { 
        id:this.AlertId,
        wellName:this.CustomAlertForm.value.WellName,
        customAlertName:this.CustomAlertForm.value.CustomAlertName,     
        notificationType:this.CustomAlertForm.value.NotificationType,
        priority:this.CustomAlertForm.value.Priority,
        category:this.CustomAlertForm.value.Category,
        operator:this.CustomAlertForm.value.Operator,
        value:this.CustomAlertForm.value.Value,
        isActive:this.CustomAlertForm.value.IsActive,
        actualValue:Actual,//this.CustomAlertForm.value.ActualValue== ? null : this.CustomAlertForm.value.ActualValue,
        startDate:this.StartDate,
        endDate:this.EndDate
      }
      this.CustomAlertService.EditCustomAlert(Obj).subscribe((res)=>{ 
        if(res!=null)
        {
          alert("Records Updated successfully");
        }     
          this.getAlertDetails();     
          this.clear();
          this.IsUpdateCondition = false;
        });
    }

    cloneAlert(Id:number)
    {      
      this.IsUpdateCondition=false;
      var GetRecord=this.AlertData.filter(a=> a.id==Id)
      if(GetRecord != null)
      {
        this.AlertId = GetRecord[0].id;
        this.IsActiveValue=GetRecord[0].isActive;
        this.CustomAlertForm.controls.CustomAlertName.setValue(GetRecord[0].customAlertName);
        this.CustomAlertForm.controls.WellName.setValue(GetRecord[0].wellName);
        this.CustomAlertForm.controls.NotificationType.setValue(GetRecord[0].notificationType);
        this.CustomAlertForm.controls.NotificationType.setValue(GetRecord[0].notificationType);        
        this.CustomAlertForm.controls.Priority.setValue(GetRecord[0].priority);
        this.CustomAlertForm.controls.Category.setValue(GetRecord[0].category);
        this.CustomAlertForm.controls.Operator.setValue(GetRecord[0].operator);
        this.CustomAlertForm.controls.Value.setValue(GetRecord[0].value);
        this.ActualValue=GetRecord[0].actualValue;
        
        if(this.ActualValue!=null)
        {
          this.IsNumeric=true;
        }
        else
        {
          this.IsNumeric=false;
        }
        let StartDate = GetRecord[0].startDate;
        let Sdate = StartDate.slice(0,10);
        let EndDate = GetRecord[0].endDate;
        let Edate =  EndDate.slice(0,10);
        this.SelectedRangeValue = new DateRange<Date>(new Date(Sdate), new Date(Edate));       
      }
    }

    deleteAlert(Id:number)
    {
      this.CustomAlertService.deleteCustomAlert(Id).subscribe((res)=>{
        alert('Record deleted successfully');
        this.getAlertDetails();
      })
    }

    toggle(Id:number,event:any){
      let Val=event.checked;
      this.CustomAlertService.isActiveCustomAlert(Id,Val).subscribe((res)=>{    
        this.getAlertDetails();    
      })
    }

    clear()
    {
      this.Submitted = false;
      this.DateFlag = false;
      this.IsNumeric = false;
      this.CustomAlertForm.get('CustomAlertName')?.reset();
      this.CustomAlertForm.get('WellName')?.reset();
      this.CustomAlertForm.get('NotificationType')?.reset();
      this.CustomAlertForm.get('Priority')?.reset();
      this.CustomAlertForm.get('Category')?.reset();
      this.CustomAlertForm.get('Operator')?.reset();
      this.CustomAlertForm.get('Value')?.reset();
      this.CustomAlertForm.get('ActualValue')?.reset();
      this.SelectedRangeValue = new DateRange<Date>(null, null);
    }

    cancel()
    {
      this.clear();
    }

    close(){
      this.dialogRef.close();
    }

}