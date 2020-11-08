import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { Song } from 'src/app/services/data-types/common.type';
import { findIndex } from 'src/app/util/array';
import { WyScrollComponent } from '../wy-scroll/wy-scroll.component';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit,OnChanges {

  @Input() songList : Song[];
  @Input() currentSong : Song;
  currentIndex : number;
  @Input() show:boolean;

  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();

  //使用viewchildren是因为 有一个歌词也需要滚动
  @ViewChildren(WyScrollComponent) private wyScroll : QueryList<WyScrollComponent>;

  scrollY = 0;

  constructor() { }



  /**
   * 监听Input的变化
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {

    if(changes['songList']){
      console.log('songList',this.songList);
      //切换歌单 肯定是0
      this.currentIndex =0;
    }

    //j监听当前播放歌曲是否改变
    if(changes['currentSong']){
      //滚动到当前歌曲
      if(this.currentSong){
        //切换歌曲 重新获取当前索引
        this.currentIndex = findIndex(this.songList,this.currentSong);

        if(this.show){
          this.scrollToCurrent();
        }
      }else{

      }
    }
    if(changes['show']){
      if(!changes['show'].firstChange && this.show){
        this.wyScroll.first.refreshScroll();
        //等滚动组件50ms刷新完成后在进行滚动
        setTimeout(() => {
          if(this.currentSong){
            this.scrollToCurrent(0);
        }},80);

      }

    }
  }

 /**
   * 滚动到当前歌曲
   */
  private scrollToCurrent(speed = 300) {
   const songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll('ul li');
   console.log("滚动条里所有li标签>>>",songListRefs);
   if(songListRefs.length){
    const currentLi = <HTMLElement>songListRefs[this.currentIndex || 0];
    const offsetTop = currentLi.offsetTop;
    const liOffsetHeight = currentLi.offsetHeight;
    console.log("scrollY",this.scrollY);
    console.log("offsetTop",offsetTop);
    console.log("liOffsetHeight",liOffsetHeight);
    if((offsetTop-Math.abs(this.scrollY)) > liOffsetHeight * 5 || offsetTop <Math.abs(this.scrollY)){
      this.wyScroll.first.scrollToElement(currentLi,speed,false,false);
    }
  }
  }

  ngOnInit(): void {
  }

}
