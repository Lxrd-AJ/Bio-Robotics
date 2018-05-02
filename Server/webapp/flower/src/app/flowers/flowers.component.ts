import { Component, OnInit } from '@angular/core';
import { FlowerService } from './../flower.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-flowers',
  templateUrl: './flowers.component.html',
  styleUrls: ['./flowers.component.css']
})
export class FlowersComponent implements OnInit {

  flowers: Object[];
  plot_data = {};
  view: any[] = [500, 300];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Timestamp';
  showYAxisLabel = true;
  yAxisLabel = 'Value';
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
    constructor(private flowerService: FlowerService ) {}

  ngOnInit() {
    this.flowerService.getFlowers()
                      .subscribe(flowers => {
                        this.flowers = flowers;
                        flowers.forEach((flower) => {
                          this.plot_data[flower["name"]] = this.setupPlotData(flower);
                        })                        
                      });
  }

  plotDataFor( flower ){    
    // var data = this.setupPlotData(flower);
    // console.info(data);
    return this.plot_data[flower["name"]];
  }

  /**
   * TODO:
   * - [ ] Pretty print the time
   * @param flower 
   */
  lastUpdatedTimeStr(flower) {
    const lastIdx = flower.measurement.length-1
    const lastObj = flower.measurement[lastIdx];
    if (lastObj == undefined){
      return "N/A"
    }else{
      return lastObj["timestamp"];
    }        
  }

  setupPlotData( flower ){
    var humidity = flower["measurement"].filter((measurement) => measurement["type"] == "HUMIDITY");
    var series_humidity = humidity.map((measurement) => {
      return {"name":measurement["timestamp"],"value":measurement["value"]}
    })

    var temp = flower["measurement"].filter((measurement) => measurement["type"] == "TEMP")
    var series_temp = temp.map((measurement) => {
      return {"name":measurement["timestamp"],"value":measurement["value"]}
    })
    
    return [{
      "name": "Temperature",
      "series": series_temp
      },{
        "name": "Humidity",
        "series": series_humidity
      }
    ]
  }

}
