import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { map } from 'rxjs/internal/operators';
import { Banner, HotTag, Singer, SongSheet } from 'src/app/services/data-types/common.type';
import { SheetService } from 'src/app/services/sheet.service';
import { AppStoreModule } from 'src/app/store';
import { SetCurrentIndex, SetPlayList, SetSongList } from 'src/app/store/actions/palyer-action';


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

  /**
   *  如果父组件的类需要读取子组件的属性值或调用子组件的方法，就不能使用本地变量方法。当父组件类需要这种访问时，可以把子组件作为 ViewChild，注入到父组件里面。
   *  属性装饰器，用于配置一个视图查询。 变更检测器会在视图的 DOM 中查找能匹配上该选择器的第一个元素或指令。 如果视图的 DOM 发生了变化，出现了匹配该选择器的新的子节点，该属性就会被更新
   */

  @ViewChild(NzCarouselComponent,{static:true}) private nzCarousel:NzCarouselComponent;
  /**
   *
   * @param ActivatedRoute 包含与当前组件相关的路由信息。ActivatedRoute 也可用于遍历路由器的状态树
   * @param sheetService
   */
  constructor(
    private route :ActivatedRoute,
    private sheetService:SheetService,
    //注入Store
    private store$: Store<AppStoreModule>
    ) {
    //从路由中获取数据 并赋值
    this.route.data.pipe(map(res=>res.homeDatas)).subscribe(([banners,hotTags,songSheet,singers])=>{
      this.banners= banners;
      this.hotTags= hotTags;
      this.songSheetList= songSheet;
      this.singers= singers;
    })

   }

   /**
    * 接收到子组件发射过来的值， 调用nzCarousel组件的pre() 或 next()
    * @param type 'pre' 或 'nxet'
    */
   onChangeSlide(type:string){
     this.nzCarousel[type]();
   }

   onBeforeChange({to}){
      this.carouselActiveIndex = to;
   }

   onPlaySheet(id:number){
    this.sheetService.playSheet(id).subscribe(list =>{
      console.log("onPlaySheet:",list)
        //执行三个动作
        this.store$.dispatch(SetSongList({ songList:list }));
        this.store$.dispatch(SetPlayList({ playList:list }));
        this.store$.dispatch(SetCurrentIndex({ currentIndex:0 }));
      });
   }











  ngOnInit(): void {
  }

}
