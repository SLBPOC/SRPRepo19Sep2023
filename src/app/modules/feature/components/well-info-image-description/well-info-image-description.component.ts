import { Component, OnInit } from '@angular/core';
import { AlgorithmsAndMitigationsService } from '../../services/algorithms-and-mitigations.service';

@Component({
  selector: 'app-well-info-image-description',
  templateUrl: './well-info-image-description.component.html',
  styleUrls: ['./well-info-image-description.component.scss']
})
export class WellInfoImageDescriptionComponent implements OnInit {
  dataResult: any;
  wellId: string = "W001";

  constructor(private service: AlgorithmsAndMitigationsService) {}

  ngOnInit(): void {
      
    this.getWellInfoById();
  }

  getWellInfoById() {
    this.service.getWellInfoById(this.wellId).subscribe((data: any) => {
      this.dataResult = data;
      console.log(this.dataResult)
    })
  }

}
