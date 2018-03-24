import { Component, OnInit } from '@angular/core';
import { FlowerService } from './../flower.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    flowers: Object[];

  constructor(private flowerService:FlowerService ) { }

  ngOnInit() {
    this.flowerService.getFlowers()
                  .subscribe(flowers => {this.flowers = flowers; console.log(flowers)});
  }

}
