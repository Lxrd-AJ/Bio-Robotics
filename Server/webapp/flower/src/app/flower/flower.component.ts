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
  view: any[] = [1000, 600];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Timestamp';
  showYAxisLabel = true;
  yAxisLabel = 'Value';
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

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
    var humidity = flower["measurement"].filter((measurement) => measurement["type"] == "HUMIDITY");
    var series_humidity = humidity.map((measurement) => {
      return {"name":measurement["timestamp"],"value":measurement["value"]}
    })

    var temp = flower["measurement"].filter((measurement) => measurement["type"] == "TEMP")
    var series_temp = temp.map((measurement) => {
      return {"name": measurement["timestamp"],"value":measurement["value"]}
    })
    console.info(series_temp)
    this.plot_data = [{
      "name": "Temperature",
      "series": series_temp
      },{
        "name": "Humidity",
        "series": series_humidity
      }
    ]
  }

  xAxisFormatter(x){
    return new Date(x).toString();
  }

}
