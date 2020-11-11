import { Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { timer } from 'rxjs';
import { Song } from 'src/app/services/data-types/common.type';
import { WINDOW } from 'src/app/services/services.module';
import { SongService } from 'src/app/services/song.service';
import { findIndex } from 'src/app/util/array';
import { WyScrollComponent } from '../wy-scroll/wy-scroll.component';
import { BaseLyricLine, WyLycir } from './WyLyric';

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
  currentLyric: BaseLyricLine[];

  constructor(private songService : SongService) {


  }



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
        //切换歌词
        this.updateLyric();
        if(this.show){
          this.scrollToCurrent();
        }
      }else{

      }
    }
    if(changes['show']){
      if(!changes['show'].firstChange && this.show){
        this.wyScroll.first.refreshScroll();
        //刷新歌词
        this.wyScroll.last.refreshScroll();
        //等滚动组件50ms刷新完成后在进行滚动
        //定时器
        timer(100).subscribe(() =>{
           if(this.currentSong){
            this.scrollToCurrent(0);
          }
        })


      }

    }
  }
  updateLyric() {
    this.songService.getLyric(this.currentSong.id).subscribe(res => {
      console.log("lyric",res.lyric);
      const lyric = new WyLycir(res);
      this.currentLyric = lyric.lines;
      console.log('this.currentLyric',this.currentLyric);

    });
  }

 /**
   * 滚动到当前歌曲
   */
  private scrollToCurrent(speed = 300) {
   const songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll('ul li');

   if(songListRefs.length){
    const currentLi = <HTMLElement>songListRefs[this.currentIndex || 0];
    const offsetTop = currentLi.offsetTop;
    const liOffsetHeight = currentLi.offsetHeight;
    // console.log("scrollY",this.scrollY);
    // console.log("offsetTop",offsetTop);
    // console.log("liOffsetHeight",liOffsetHeight);
    if((offsetTop-Math.abs(this.scrollY)) > liOffsetHeight * 4 || offsetTop <Math.abs(this.scrollY)){

      this.wyScroll.first.scrollToElement(currentLi,speed,false,false);
    }
  }
  }

  ngOnInit(): void {
  }

}
