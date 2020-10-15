import { Component, OnInit, ViewChild } from '@angular/core';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { Banner, HotTag, SongSheet } from 'src/app/services/data-types/common.type';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  carouselActiveIndex =0;
  banners:Banner[];
  hotTags:HotTag[];
  songSheetList:SongSheet[];

  @ViewChild(NzCarouselComponent,{static:true}) private nzCarousel:NzCarouselComponent;

  constructor(private homeServie:HomeService) {
    this.getBanners();
    this.getHotTags();
    this.getPersonalSheetList();
   }

   getBanners(){
    this.homeServie.getBanners().subscribe(banners=>{
      this.banners = banners;
    })
   }


   getHotTags(){
    this.homeServie.getHotTags().subscribe(hotTahs=>{
      this.hotTags = hotTahs;
    })
   }

   getPersonalSheetList(){
     this.homeServie.getPersonalSheetList().subscribe(songSheet=>{
      this.songSheetList = songSheet;
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
