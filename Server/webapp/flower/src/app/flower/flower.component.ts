import { Component, OnInit } from '@angular/core';
import { FlowerService } from './../flower.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-flower',
  templateUrl: './flower.component.html',
  styleUrls: ['./flower.component.css']
})
export class FlowerComponent implements OnInit {

  flower:Object;
  plot_data: any [];
  view: any[] = [700, 400];

  constructor(private flowerService: FlowerService, private route: ActivatedRoute, private location: Location) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.flowerService.getFlower(id).subscribe(res => {
      this.flower = res[0]; 
      this.setupPlotData( this.flower );
      console.info(res[0])
    });
  }

  setupPlotData( flower ){
    this.plot_data = [{
      "name": "Humidity",
      "series": [
        {
          "name": "2010",
          "value": 7870000
        },
        {
          "name": "2011",
          "value": 8270000
        }
      ]
    }]
  }

}
