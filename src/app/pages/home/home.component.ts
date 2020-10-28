import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { map } from 'rxjs/internal/operators';
import { Banner, HotTag, Singer, SongSheet } from 'src/app/services/data-types/common.type';
import { SheetService } from 'src/app/services/sheet.service';


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
  singers:Singer[];

  @ViewChild(NzCarouselComponent,{static:true}) private nzCarousel:NzCarouselComponent;
<<<<<<< HEAD

  constructor(
    private route :ActivatedRoute,
    private sheetService:SheetService) {

=======
  /**
   *
   * @param ActivatedRoute 包含与当前组件相关的路由信息。ActivatedRoute 也可用于遍历路由器的状态树
   * @param sheetService
   */
  constructor(private route :ActivatedRoute,private sheetService:SheetService) {
    //从路由中获取数据 并赋值
>>>>>>> 7363550fa17e50cd79b2644eb647c3856d3cc544
    this.route.data.pipe(map(res=>res.homeDatas)).subscribe(([banners,hotTags,songSheet,singers])=>{
      this.banners= banners;
      this.hotTags= hotTags;
      this.songSheetList= songSheet;
      this.singers= singers;
    })

   }

  //  getBanners(){
  //   this.homeServie.getBanners().subscribe(banners=>{
  //     this.banners = banners;
  //   })
  //  }


  //  getHotTags(){
  //   this.homeServie.getHotTags().subscribe(hotTahs=>{
  //     this.hotTags = hotTahs;
  //   })
  //  }

  //  getPersonalSheetList(){
  //    this.homeServie.getPersonalSheetList().subscribe(songSheet=>{
  //     this.songSheetList = songSheet;
  //   })
  //  }


  //  getEnterSingers(){
  //    this.singerService.getEnterSingers().subscribe(singers=>{
  //      this.singers=singers;
  //    })
  //  }




   onChangeSlide(type:string){
     this.nzCarousel[type]();
   }

   onBeforeChange({to}){
      this.carouselActiveIndex = to;
   }

   onPlaySheet(id:number){

    this.sheetService.playSheet(id).subscribe(res =>{
       console.log("onPlaySheet:",res)
     });
   }











  ngOnInit(): void {
  }

}
