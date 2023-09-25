import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WellsService } from '../../services/wells.service';
import { AlertListService } from '../../services/alert-list.service';
import { EventListService } from '../../services/event-list.service';
import { color } from 'highcharts';

interface ISpmSlider {
  min: 0,
  max: 20,
  start: 0,
  end: 20
}
interface IPumpFillageSlider {
  min: 0,
  max: 100,
  start: 0,
  end: 100
}
interface IInferredProductionSlider {
  min: 0,
  max: 100,
  start: 0,
  end: 100
}
interface IEffectiveRuntimeSlider {
  min: 0,
  max: 100,
  start: 0,
  end: 100
}
interface IcyclesTodaySlider {
  min: 0,
  max: 100,
  start: 0,
  end: 100
}
interface IstructuralLoadSlider {
  min: 0,
  max: 100,
  start: 0,
  end: 100
}
interface IminMaxLoadSlider {
  min: 0,
  max: 100,
  start: 0,
  end: 100
}
interface IgearboxLoadSlider {
  min: 0,
  max: 100,
  start: 0,
  end: 100
}
interface IrodStressSlider {
  min: 0,
  max: 100,
  start: 0,
  end: 100
}
@Component({
  selector: 'app-well-filter-and-sort',
  templateUrl: './well-filter-and-sort.component.html',
  styleUrls: ['./well-filter-and-sort.component.scss'],
})
export class WellFilterAndSortComponent implements OnInit {
  @Output('filterRefresh') filterRefresh: EventEmitter<any> = new EventEmitter();
  @Input() customizeComponentName!: 'alerts' | 'events' | undefined;
  @Input() DynamicColumn:{ label: string, accessor: string, header: string }[] = [];
  ColumnList:any[];
  panelOpenState: boolean;
  panelOpenState2: boolean;
  panelOpenState3: boolean;
  panelOpenState4: boolean;
  panelOpenState5: boolean;
  panelOpenState6: boolean;
  panelOpenState7: boolean;
  wellList: any[];
  providers = new FormControl();
  allProviders!: any;
  commsStatusOptions!: any;
  controllerStatusOptions!: any;
  pumpingTypeOptions!: any;
  filtersApplied = {
    wellNames: false,
    commsStatus: false,
    controllerStatus: false,
    pumpingTypes: false,
    spm: false,
    pumpFillage: false,
    inferredProduction: false,
    effectiveRuntime:false,
    cyclesToday:false,
    structuralLoad:false,
    minMaxLoad:false,
    gearboxLoad:false,
rodStress:false
  }
  spmSlider: ISpmSlider = { min: 0, max: 20, start: 0, end: 20 }
  pumpFillageSlider: IPumpFillageSlider = { min: 0, max: 100, start: 0, end: 100 };
  inferredProductionSlider: IInferredProductionSlider = { min: 0, max: 100, start: 0, end: 100 }
  effectiveRuntimeSlider: IEffectiveRuntimeSlider = { min: 0, max: 100, start: 0, end: 100 }
  cyclesTodaySlider: IcyclesTodaySlider = { min: 0, max: 100, start: 0, end: 100 }
  structuralLoadSlider: IstructuralLoadSlider = { min: 0, max: 100, start: 0, end: 100 }
  minMaxLoadSlider: IminMaxLoadSlider = { min: 0, max: 100, start: 0, end: 100 }
  gearboxLoadSlider: IgearboxLoadSlider = { min: 0, max: 100, start: 0, end: 100 }
  rodStressSlider: IrodStressSlider = { min: 0, max: 100, start: 0, end: 100 }
  filteredProviders: any[] = this.allProviders;
  selectedWellNames = new FormControl();
  selectedCategories = new FormControl();
  selectedWells = [];
  selectedCategory = [];
  wellNames: any;
  category: any = [
    {
        "value": "SPM"
    },
    {
        "value": "Distorted Card Events"
    },
    {
        "value": "Tagging Events"
    },
    {
        "value": "Flatlining Events"
    },
    {
        "value": "Gas Interference Events"
    },
    {
        "value": "Fluid Pound Events"
    },
    {
        "value": "time"
    },
    {
        "value": "Yesterday Run time"
    },
    {
        "value": "Load"
    },
    {
        "value": "Pump Fillage"
    },
    {
        "value": "Shutdowns"
    }
]
  eventTypes = [];
  isAlerts = true;
  
  constructor(private service: WellsService, private alertService: AlertListService,
    private eventService: EventListService) { }

  ngOnInit(): void {
    this.getDefaultValues();
    if (this.customizeComponentName === 'alerts') {
      this.getAlertDetails();
    }
    let obj={ label:"test",accessor:"test", header:"test"}
    this.DynamicColumn.push(obj);
  }
  ngOnChanges()
  {
    const test=this.DynamicColumn.map(ele=>ele.accessor)
    this.ColumnList=test;
    let effectiveRuntime = this.ColumnList.find((e: any) => e.value === "effectiveRuntime");
    if(!effectiveRuntime)
    {
      this.effectiveRuntimeSlider.start=0;
      this.effectiveRuntimeSlider.end=100;
    }
    let cycleToday = this.ColumnList.find((e: any) => e.value === "cycleToday");
    if(!cycleToday)
    {
      this.cyclesTodaySlider.start=0;
      this.cyclesTodaySlider.end=100;
    }
    let structuralLoad = this.ColumnList.find((e: any) => e.value === "structuralLoad");
    if(!structuralLoad)
    {
      this.structuralLoadSlider.start=0;
      this.structuralLoadSlider.end=100;
    }
    let minMaxLoad = this.ColumnList.find((e: any) => e.value === "minMaxLoad");
    if(!minMaxLoad)
    {
      this.minMaxLoadSlider.start=0;
      this.minMaxLoadSlider.end=100;
    }
    let gearboxLoad = this.ColumnList.find((e: any) => e.value === "gearboxLoad");
    if(!gearboxLoad)
    {
      this.gearboxLoadSlider.start=0;
      this.gearboxLoadSlider.end=100;
    }
    let rodStress = this.ColumnList.find((e: any) => e.value === "rodStress");
    if(!rodStress)
    {
      this.rodStressSlider.start=0;
      this.rodStressSlider.end=100;
    }
  }


  getAlertDetails() {
    this.alertService.getDefaultAlertCategory().subscribe((resp) => {
      this.wellNames = resp.wellNames;
    });
  }
  getEventDetails() {
    debugger;
    var SearchModel = this.createModel();
    this.eventService.getEventList(SearchModel).subscribe((resp) => {
      this.wellNames = resp.wellNames;
      this.eventTypes = resp.eventType;
    });
  }

  ///for Events
  createModel(this: any) {
    let dateObj = {
      fromDate: '',
      toDate: '',
    };
    this.model.pageSize = this.pageSize;
    this.model.pageNumber = this.pageNumber;
    this.model.searchText = this.searchText ? this.searchText : '';
    this.model.sortColumn = this.sortColumn ? this.sortColumn : '';
    this.model.sortDirection = this.sortDirection ? this.sortDirection : '';
    this.model.searchStatus = this.seachByStatus ? this.seachByStatus : '';
    this.model.dateRange = dateObj;
    this.model.wellNames = this.selectedWells ? this.selectedWells : [];
    this.model.category = this.selectedCategory ? this.selectedCategory : [];
    this.model.ids = this.ids ? this.ids : [];

    return this.model;
  }


  getDefaultValues() {
    this.service.GetWellFilterDefaultValues().subscribe((response: any) => {
      //console.log('===> dropdown data', response);
      this.commsStatusOptions = response.commStatus;
      this.controllerStatusOptions = response.controllerStatus;
      this.pumpingTypeOptions = response.pumpingTypes;
      this.spmSlider = response.spmSlider;
      this.pumpFillageSlider = response.pumpFillageSlider;
      this.inferredProductionSlider = response.inferredProductionSlider;
   this.effectiveRuntimeSlider = response.effectiveRuntimeSlider;
      this.cyclesTodaySlider=response.cyclesTodaySlider;
      this.structuralLoadSlider=response.structuralLoadSlider;
      this.minMaxLoadSlider=response.minMaxLoadSlider
      this.gearboxLoadSlider=response.gearboxLoadSlider;
      this.gearboxLoadSlider=response.rodStressSlider;
      this.wellList = response.wellNames;
    })
  }

  onInputChange(event: any) {
    const searchInput = event.target.value.toLowerCase();
    this.filteredProviders = this.allProviders.filter(({ value }) => {
      const prov = value.toLowerCase();
      return prov.includes(searchInput);
    });
  }

  onOpenChange(searchInput: any) {
    searchInput.value = "";
    this.filteredProviders = this.allProviders;

  }

  onWellSelection(selectedWellNamesArray: any) {
    this.selectedWells = selectedWellNamesArray;
    this.filtersApplied.wellNames = selectedWellNamesArray.length > 0;
    this.updateAppliedFilter();
  }

  clearAppliedFilter() {
    this.clearWellNames();
    this.clearCommStatus();
    this.clearControllerStatus();
    this.clearPumpingTypes();
    this.clearSpm();
    this.clearInferredProduction();
    this.clearPumpFillage();
    this.updateAppliedFilter();
    this.clearCategories();
    
    this.filterRefresh.emit({
      "pageSize": 5,
      "pageNumber": 1,
      "searchText": "",
      "sortColumn": "",
      "sortDirection": "",
      "searchStatus": ""
    })
  }
  clearCategories(){

    this.selectedCategories.setValue([]);

  }
  clearCommStatus() {
    this.commsStatusOptions.map((element: any) => element.checked = false);
    this.filtersApplied.commsStatus = false;
  }

  clearControllerStatus() {
    this.controllerStatusOptions.map((element: any) => element.checked = false);
    this.filtersApplied.controllerStatus = false;
  }

  clearPumpingTypes() {
    this.pumpingTypeOptions.map((element: any) => element.checked = false);
    this.filtersApplied.pumpingTypes = false;
  }

  clearWellNames() {
    this.providers.setValue([]);
    this.filtersApplied.wellNames = false;
  }

  applyFilter(isChecked, filterOption) {
    let isCommsStatus = this.commsStatusOptions.find((e: any) => e.value === filterOption);
    let isControllerStatus = this.controllerStatusOptions.find((e: any) => e.value === filterOption);

    if (isCommsStatus) {
      const index = this.commsStatusOptions.findIndex((element: any) => element.value === filterOption);
      this.commsStatusOptions[index].checked = isChecked;
    }
    if (isControllerStatus) {
      const index = this.controllerStatusOptions.findIndex((element: any) => element.value === filterOption);
      this.controllerStatusOptions[index].checked = isChecked;
    }
    this.updateAppliedFilter();
  }

  clearSpm() {
    this.spmSlider.start = 0;
    this.spmSlider.end = 20;
    this.filtersApplied.spm = false;
  }

  clearPumpFillage() {
    this.pumpFillageSlider.start = 0;
    this.pumpFillageSlider.end = 100;
    this.filtersApplied.pumpFillage = false;

  }

  clearInferredProduction() {
    this.inferredProductionSlider.start = 0;
    this.inferredProductionSlider.end = 100;
    this.filtersApplied.inferredProduction = false;
  }
  cleareffectiveRunTime() {
    this.effectiveRuntimeSlider.start = 0;
    this.effectiveRuntimeSlider.end = 100;
    this.filtersApplied.effectiveRuntime = false;
  }
  onCategorySelection(selectedCategoryArray: any) {
    this.selectedCategory = selectedCategoryArray;
  }

  submitAppliedFilters() {
    const commStatus = this.commsStatusOptions.filter((element: any) => element.checked === true)
      .reduce((acc, element, index) => {
        acc.push(element.value)
        return acc;
      }, [])

    const controllerStatus = this.controllerStatusOptions.filter((element: any) => element.checked === true)
      .reduce((acc, element, index) => {
        acc.push(element.value)
        return acc;
      }, [])

    const pumpingType = this.pumpingTypeOptions.filter((element: any) => element.checked === true)
      .reduce((acc, element, index) => {
        acc.push(element.value)
        return acc;
      }, [])

      let payload = {};
      if(this.customizeComponentName === 'alerts') {
        payload = {
          pageSize: 5,
          pageNumber: 1,
          searchText: '',
          sortColumn: '',
          sortDirection: '',
          searchStatus: '',
          dateRange: {
            fromDate: '',
            toDate: '',
          },
          wellNames: this.selectedWells,
          category: this.selectedCategory,
          ids: [],
        };
      } else {
        payload = {
          "pageSize": 5,
          "pageNumber": 1,
          "searchText": "",
          "sortColumn": "",
          "sortDirection": "",
          "searchStatus": "",
          "wellNames": this.providers.value,
          "commStatus": commStatus,
          "controllerStatus": controllerStatus,
          "pumpingType": pumpingType,
          "spm": {
            start: this.spmSlider.start,
            end: this.spmSlider.end
          }, "pumpFillage": {
            start: this.pumpFillageSlider.start,
            end: this.pumpFillageSlider.end
          }, "inferredProduction": {
            start: this.inferredProductionSlider.start,
            end: this.inferredProductionSlider.end
          },
          
          "effectiveRuntime": {
         
            start: this.effectiveRuntimeSlider.start,
            end: this.effectiveRuntimeSlider.end
          },
          "cyclesToday": {
            start: this.cyclesTodaySlider.start,
            end: this.cyclesTodaySlider.end
          },
          "structuralLoad": {
            start: this.structuralLoadSlider.start,
            end: this.structuralLoadSlider.end
          },
          "minMaxLoad": {
            start: this.minMaxLoadSlider.start,
            end: this.minMaxLoadSlider.end
          },
          "gearboxLoad": {
            start: this.gearboxLoadSlider.start,
            end: this.gearboxLoadSlider.end
          },
          "rodStress": {
            start: this.rodStressSlider.start,
            end: this.rodStressSlider.end
          },
        }
      }
    this.filterRefresh.emit(payload);
  }

  updateAppliedFilter() {
    this.commsStatusOptions.every((element: any) => element.checked === false) ? this.filtersApplied.commsStatus = false : this.filtersApplied.commsStatus = true;
    this.controllerStatusOptions.every((element: any) => element.checked === false) ? this.filtersApplied.controllerStatus = false : this.filtersApplied.controllerStatus = true;
    this.pumpingTypeOptions.every((element: any) => element.checked === false) ? this.filtersApplied.pumpingTypes = false : this.filtersApplied.pumpingTypes = true;
  }

  formatLabel(value: number): string {
    let percentageValue = Math.round((value) * 100) / 100
    return `${percentageValue}%`;
  }

  formatLabelSPM(value: number): string {
    let percentageValue = Math.round((value) * 100) / 100
    return `${percentageValue}`;
  }

}
