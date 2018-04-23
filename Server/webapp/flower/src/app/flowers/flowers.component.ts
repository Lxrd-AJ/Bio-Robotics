import { Component, OnInit } from '@angular/core';
import { FlowerService } from './../flower.service';

@Component({
  selector: 'app-flowers',
  templateUrl: './flowers.component.html',
  styleUrls: ['./flowers.component.css']
})
export class FlowersComponent implements OnInit {

  flowers: Object[];
    constructor(private flowerService: FlowerService ) {}

  ngOnInit() {
    this.flowerService.getFlowers()
                      .subscribe(flowers => this.flowers = flowers );
  }

}
