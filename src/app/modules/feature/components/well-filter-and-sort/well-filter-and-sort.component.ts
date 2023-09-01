import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { WellsService } from '../../services/wells.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { WellsComponent } from '../wells/wells.component';

@Component({
  selector: 'app-well-filter-and-sort',
  templateUrl: './well-filter-and-sort.component.html',
  styleUrls: ['./well-filter-and-sort.component.scss'],
})
export class WellFilterAndSortComponent {

  panelOpenState: boolean;
  panelOpenState2: boolean;
  panelOpenState3: boolean;
  panelOpenState4: boolean;
  panelOpenState5: boolean;
  panelOpenState6: boolean;
  panelOpenState7: boolean;

  filtersApplied = {
    wellNames: false,
    commsStatus: false,
    controllerStatus: false,
    pumpingTypes: false
  }
  constructor(private _liveAnnouncer: LiveAnnouncer, private service: WellsService, private router: Router) { }

  providers = new FormControl();
  allProviders: any[] = [{ value: "Apache 24 FED 11"}, { value: "Apache 24 FED 12"}, { value: "Apache 24 FED 13"}];
  commsStatusOptions: any[] = [{ value: "Comms Failed", checked: false }, { value: "Comms Established", checked: false }];
  controllerStatusOptions: any[] = [{ value: "Shutdown", checked: false }, { value: "Hand(Manual)", checked: false }, { value: "Auto", checked: false }];
  pumpingTypeOptions = [{ value: "Over Pumping", checked: false }, { value: "Optimum Pumping", checked: false }, { value: "Under Pumping", checked: false }];
  spmSlider = {
    min: 0,
    max: 100,
    start: 0,
    end: 100
  }
  pumpFillageSlider = {
    min: 0,
    max: 100,
    start: 0,
    end: 100
  }

  inferredProductionSlider = {
    min: 0,
    max: 100,
    start: 0,
    end: 100
  }
  filteredProviders: any[] = this.allProviders;

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
    this.filtersApplied.wellNames = selectedWellNamesArray.length > 0;
    this.updateAppliedFilter();
  }

  clearAppliedFilter() {
    this.clearWellNames();
    this.clearCommStatus();
    this.clearControllerStatus();
    this.clearPumpingTypes();
    this.updateAppliedFilter();
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
    let isCommsStatus = filterOption === 'Comms Failed' || filterOption === 'Comms Established'
    let isControllerStatus = filterOption === 'Shutdown' || filterOption === 'Hand (Manual)' || filterOption === 'Auto';
    if(isCommsStatus) {
      const index = this.commsStatusOptions.findIndex((element: any) => element.value === filterOption);
      this.commsStatusOptions[index].checked = isChecked;
    }
    if(isControllerStatus) {
      const index = this.controllerStatusOptions.findIndex((element: any) => element.value === filterOption);
      this.controllerStatusOptions[index].checked = isChecked;
    }
    this.updateAppliedFilter();
    
  }

  submitAppliedFilters() {
    console.log('commStatus:- ', this.commsStatusOptions);
    console.log('controllerStatus:- ', this.controllerStatusOptions);
    console.log('pumpingStatus:- ', this.pumpingTypeOptions)
    console.log('spm:- ', this.spmSlider)
    console.log('pumpFillage:- ', this.pumpFillageSlider)
    console.log('inferredProductionSlider:- ', this.inferredProductionSlider);

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

    const payload = {
      "pageSize": 10,
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
      },"pumpFillage": {
        start: this.pumpFillageSlider.start,
        end: this.pumpFillageSlider.end
      },"inferredProduction": {
        start: this.inferredProductionSlider.start,
        end: this.inferredProductionSlider.end
      },
  }

  console.log('applied filters payload ===>', payload);
  let wellComp = new WellsComponent(this._liveAnnouncer,this.service,this.router);  
  wellComp.getWellDetailsWithFiltersAndSort(payload)
  }
  
  updateAppliedFilter() {
    this.commsStatusOptions.every((element: any) => element.checked === false) ? this.filtersApplied.commsStatus = false : this.filtersApplied.commsStatus = true;
    this.controllerStatusOptions.every((element: any) => element.checked === false) ? this.filtersApplied.controllerStatus = false : this.filtersApplied.controllerStatus = true;
    this.pumpingTypeOptions.every((element: any) => element.checked === false) ? this.filtersApplied.pumpingTypes = false : this.filtersApplied.pumpingTypes = true;

  }

  formatLabel(value: number): string {
    let percentageValue = Math.round((value)*100) / 100 
    return `${percentageValue}%`;
  }
}
