import { Component, OnInit, ViewChild } from '@angular/core';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { Banner } from 'src/app/services/data-types/common.type';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  carouselActiveIndex =0;
  banners:Banner[];

  @ViewChild(NzCarouselComponent,{static:true}) private nzCarousel:NzCarouselComponent;

  constructor(private homeServie:HomeService) {

    this.homeServie.getBanners().subscribe(banners=>{
      this.banners = banners;
    })

   }

   onChangeSlide(type:string){
     this.nzCarousel[type]();
   }

   onBeforeChange({to}){
      this.carouselActiveIndex = to;
   }

  ngOnInit(): void {
  }

}
