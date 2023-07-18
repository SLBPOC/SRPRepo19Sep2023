import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AlgorithmsAndMitigationsService } from '../../services/algorithms-and-mitigations.service';

interface Tag {
  tagTitle: string,
  tagContent: string,
  tagInfo: string
}

interface TagSelect {
  id: number,
  tag: string
}

interface Controller {
  id: number,
  controller: string
}

@Component({
  selector: 'app-algorithms-and-mitigation',
  templateUrl: './algorithms-and-mitigation.component.html',
  styleUrls: ['./algorithms-and-mitigation.component.scss']
})
export class AlgorithmsAndMitigationComponent implements OnInit{

  controllerSelectOptions: string[] = [];
  tagControl = new FormControl('');
  tagSelectOptions: string[] = [];
  panelOpenState = true;
  tagsDetailsData: Tag[] = [];
  tagsTotal:number;
  tagsSelected: number | undefined;

  constructor(private service: AlgorithmsAndMitigationsService) {}

  ngOnInit(): void {
    this.getControllerSelectOptions();
    this.getTagSelectOptions();
    this.getTagData();
  }

  getControllerSelectOptions() {
    this.service.getControllerSelectOptionsData().subscribe((data: Controller[]) => {
      this.controllerSelectOptions = data.map((value: Controller) => value.controller)
    })
  }

  getTagSelectOptions() {
    this.service.getTagSelectOptions().subscribe((data: TagSelect[]) => {
      this.tagsTotal = data.length;
      this.tagSelectOptions = data.map((value: TagSelect) => value.tag);
      console.log('tagSelectOptions:- ', this.tagSelectOptions)
    })
  }

  getTagData() {
    this.service.getTagsData().subscribe((data: any) => {
      this.tagsDetailsData = data;
      console.log('tagData:- ', this.tagsDetailsData)
    })
  }

  onTagSelectionChanged(event: any) {
    console.log('on tag selection changed:- ', this.tagControl)
    this.tagsSelected = this.tagControl.value?.length
  }

  applyTags() {
    const payload = {
      tags: this.tagControl.value
    }
    this.service.applyTags(payload).subscribe((data: any) => {
      console.log('tag applied.');
    })
  }

  saveTags() {
    const payload = {
      tags: this.tagControl.value
    }
    this.service.applyTags(payload).subscribe((data: any) => {
      console.log('tag saved.');
    })
  }

}
