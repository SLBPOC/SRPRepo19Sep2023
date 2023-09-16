import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WellsService } from '../../services/wells.service';
import { AlertListService } from '../../services/alert-list.service';
import { EventListService } from '../../services/event-list.service';

interface ISpmSlider {
  min: 0;
  max: 20;
  start: 0;
  end: 20;
}
interface IPumpFillageSlider {
  min: 0;
  max: 100;
  start: 0;
  end: 100;
}
interface IInferredProductionSlider {
  min: 0;
  max: 100;
  start: 0;
  end: 100;
}

@Component({
  selector: 'app-well-filter-and-sort',
  templateUrl: './well-filter-and-sort.component.html',
  styleUrls: ['./well-filter-and-sort.component.scss'],
})
export class WellFilterAndSortComponent implements OnInit {
  @Output('filterRefresh') filterRefresh: EventEmitter<any> =
    new EventEmitter();
  panelOpenState: boolean;
  panelOpenState2: boolean;
  panelOpenState3: boolean;
  panelOpenState4: boolean;
  panelOpenState5: boolean;
  panelOpenState6: boolean;
  panelOpenState7: boolean;
  wellList: any[];
  providers = new FormControl();
  selectedWellNames = new FormControl();
  selectedCategories = new FormControl();
  allProviders!: any;
  commsStatusOptions!: any;
  controllerStatusOptions!: any;
  pumpingTypeOptions!: any;
  selectedWells = [];
  selectedCategory = [];
  wellNames: any;
  category: any;
  eventTypes = [];
  filtersApplied = {
    wellNames: false,
    commsStatus: false,
    controllerStatus: false,
    pumpingTypes: false,
    spm: false,
    pumpFillage: false,
    inferredProduction: false,
    category: false
  }
  @Input() isAlerts!: any;
  @Input() isEvent!: any;
  spmSlider: ISpmSlider = { min: 0, max: 20, start: 0, end: 20 };
  pumpFillageSlider: IPumpFillageSlider = {
    min: 0,
    max: 100,
    start: 0,
    end: 100,
  };
  inferredProductionSlider: IInferredProductionSlider = {
    min: 0,
    max: 100,
    start: 0,
    end: 100,
  };
  filteredProviders: any[] = this.allProviders;

  constructor(
    private service: WellsService,
    private alertService: AlertListService,
    private eventService: EventListService
  ) {}

  ngOnInit(): void {
    this.getDefaultValues();
    this.isAlerts;
    this.isEvent;
    if (this.isAlerts) {
      this.getAlertDetails();
    }
    if (this.isEvent) {
      this.getEventDetails();
    }
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
      this.wellList = response.wellNames;
    });
  }

  getAlertDetails() {
    this.alertService.getDefaultAlertCategory().subscribe((resp) => {
      this.wellNames = resp.wellNames;
      this.category = resp.category;
    });
  }
  getEventDetails() {
    debugger;
    var SearchModel = this.createModel();
    this.eventService.getAlertList(SearchModel).subscribe((resp) => {
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

  onInputChange(event: any) {
    const searchInput = event.target.value.toLowerCase();
    this.filteredProviders = this.allProviders.filter(({ value }) => {
      const prov = value.toLowerCase();
      return prov.includes(searchInput);
    });
  }
  ////For Events
  onOpenChange(searchInput: any) {
    searchInput.value = '';
    this.filteredProviders = this.allProviders;
  }

  onWellSelection(selectedWellNamesArray: any) {
    this.selectedWells = selectedWellNamesArray;
    this.filtersApplied.wellNames = selectedWellNamesArray.length > 0;
    // this.updateAppliedFilter();
  }

  onCategorySelection(selectedCategoryArray: any) {
    this.selectedCategory = selectedCategoryArray;
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
    this.filterRefresh.emit({
      pageSize: 5,
      pageNumber: 1,
      searchText: '',
      sortColumn: '',
      sortDirection: '',
      searchStatus: '',
    });
  }

  clearCommStatus() {
    this.commsStatusOptions.map((element: any) => (element.checked = false));
    this.filtersApplied.commsStatus = false;
  }

  clearControllerStatus() {
    this.controllerStatusOptions.map(
      (element: any) => (element.checked = false)
    );
    this.filtersApplied.controllerStatus = false;
  }

  clearPumpingTypes() {
    this.pumpingTypeOptions.map((element: any) => (element.checked = false));
    this.filtersApplied.pumpingTypes = false;
  }

  clearWellNames() {
    this.selectedWellNames.setValue([]);
    this.filtersApplied.wellNames = false;
  }

  clearCategories() {
    this.selectedCategories.setValue([]);
    this.filtersApplied.category = false;
  }

  applyFilter(isChecked, filterOption) {
    let isCommsStatus = this.commsStatusOptions.find(
      (e: any) => e.value === filterOption
    );
    let isControllerStatus = this.controllerStatusOptions.find(
      (e: any) => e.value === filterOption
    );

    if (isCommsStatus) {
      const index = this.commsStatusOptions.findIndex(
        (element: any) => element.value === filterOption
      );
      this.commsStatusOptions[index].checked = isChecked;
    }
    if (isControllerStatus) {
      const index = this.controllerStatusOptions.findIndex(
        (element: any) => element.value === filterOption
      );
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

  submitAppliedFilters() {
    // const commStatus = this.commsStatusOptions.filter((element: any) => element.checked === true)
    // .reduce((acc, element, index) => {
    //   acc.push(element.value)
    //   return acc;
    // }, [])

    // const controllerStatus = this.controllerStatusOptions.filter((element: any) => element.checked === true)
    // .reduce((acc, element, index) => {
    //   acc.push(element.value)
    //   return acc;
    // }, [])

    // const pumpingType = this.pumpingTypeOptions.filter((element: any) => element.checked === true)
    // .reduce((acc, element, index) => {
    //   acc.push(element.value)
    //   return acc;
    // }, [])
    let payload = {};
    if (this.isAlerts) {
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
        pageSize: 5,
        pageNumber: 1,
        searchText: '',
        sortColumn: '',
        sortDirection: '',
        searchStatus: '',
        wellNames: this.providers.value,
        // "commStatus": commStatus,
        // "controllerStatus": controllerStatus,
        // "pumpingType": pumpingType,
        spm: {
          start: this.spmSlider.start,
          end: this.spmSlider.end,
        },
        pumpFillage: {
          start: this.pumpFillageSlider.start,
          end: this.pumpFillageSlider.end,
        },
        inferredProduction: {
          start: this.inferredProductionSlider.start,
          end: this.inferredProductionSlider.end,
        },
      };
    }
    this.filterRefresh.emit(payload);
  }

  updateAppliedFilter() {
    this.commsStatusOptions.every((element: any) => element.checked === false)
      ? (this.filtersApplied.commsStatus = false)
      : (this.filtersApplied.commsStatus = true);
    this.controllerStatusOptions.every(
      (element: any) => element.checked === false
    )
      ? (this.filtersApplied.controllerStatus = false)
      : (this.filtersApplied.controllerStatus = true);
    this.pumpingTypeOptions.every((element: any) => element.checked === false)
      ? (this.filtersApplied.pumpingTypes = false)
      : (this.filtersApplied.pumpingTypes = true);
  }

  formatLabel(value: number): string {
    let percentageValue = Math.round(value * 100) / 100;
    return `${percentageValue}%`;
  }

  formatLabelSPM(value: number): string {
    let percentageValue = Math.round(value * 100) / 100;
    return `${percentageValue}`;
  }
}
