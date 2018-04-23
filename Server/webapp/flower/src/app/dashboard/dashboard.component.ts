import { Component, OnInit } from '@angular/core';
import { FlowerService } from './../flower.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    flowers: Object[];
    overview: Object;

  constructor(private flowerService:FlowerService ) { }

  ngOnInit() {
    this.flowerService.getFlowers()
                  .subscribe(flowers => {this.flowers = flowers; console.log(flowers)});
    
    this.flowerService.getOverview().subscribe(res => {
      this.overview = res;
      this.overview["avg_temp"] = res["avg_temp"].toPrecision(3);
      this.overview["avg_humidity"] = res["avg_humidity"].toPrecision(2);
    });
  }

}
