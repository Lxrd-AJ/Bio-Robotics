import { Component, OnInit } from '@angular/core';
import { FlowerService } from './../flower.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-flower',
  templateUrl: './flower.component.html',
  styleUrls: ['./flower.component.css']
})
export class FlowerComponent implements OnInit {

  flower:Object

  constructor(private flowerService: FlowerService, private route: ActivatedRoute, private location: Location) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.flowerService.getFlower(id).subscribe(res => {this.flower = res[0]; console.info(res[0])});
  }

}
