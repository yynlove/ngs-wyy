import { Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { timer } from 'rxjs';
import { Song } from 'src/app/services/data-types/common.type';
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


  //歌曲是否播放
  @Input() playing:boolean;
  //歌曲播放列表
  @Input() songList : Song[];
  @Input() currentSong : Song;
  currentIndex : number;
  //歌曲列表面板是否显示
  @Input() show:boolean;

  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();

  //使用viewchildren是因为 有一个歌词也需要滚动
  @ViewChildren(WyScrollComponent) private wyScroll : QueryList<WyScrollComponent>;

  scrollY = 0; //接受的bs纵轴坐标  相当于左侧滑块的偏移量

  currentLyric: BaseLyricLine[];
  //当前播放的行
  currentLineNum: number;
  //歌词
  private lyric : WyLycir;
  //歌词元素list
  private lyricRefs :NodeList;


  constructor(private songService : SongService) {
  }



  /**
   * 监听Input的变化
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    //判断歌曲的播放状态是否改变
    if(changes['playing']){
      if(!changes['playing'].firstChange){
        this.lyric && this.lyric.togglePlay(this.playing);

      }
    }


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
        //重置歌词
          this.resetLyric();
      }
    }
    if(changes['show']){
      if(!changes['show'].firstChange && this.show){
        this.wyScroll.first.refreshScroll();
        //刷新歌词
        this.wyScroll.last.refreshScroll();
        //等滚动组件50ms刷新完成后在进行滚动
        //定时器
        timer(50).subscribe(() =>{
           if(this.currentSong){
            this.scrollToCurrent(0);
          }
        })


      }

    }
  }
  updateLyric() {
    //切歌时，重置歌词
    this.resetLyric();

    this.songService.getLyric(this.currentSong.id).subscribe(res => {
     // console.log("lyric",res.lyric);
      this.lyric = new WyLycir(res);
      this.currentLyric = this.lyric.lines;
     // console.log('this.currentLyric',this.currentLyric);
     //订阅多播
      const startLine = res.tlyric? 1:2;
      this.handleLyric(startLine);

      this.wyScroll.last.scrollTo(0,0);
      //如果歌曲播放 歌词也要跟着播放
      if(this.playing){
        this.lyric.play();
      }
    });
  }
  //重置歌词
  resetLyric() {
    if(this.lyric){
      this.lyric.stop();
      this.currentLineNum=0;
      this.currentLyric=[];
      this.lyric = null;
      this.lyricRefs = null;

    }
  }

  //播放进度条改变时跳转歌词
  seekLyric(timer:number){
    if(this.lyric){
      this.lyric.seek(timer);
    }
  }

  handleLyric(startLine) {
    this.lyric.handler.subscribe(({lineNum})=>{
      //播放时滚动歌词面板 并设置当前播放行
      if(!this.lyricRefs){
        this.lyricRefs =this.wyScroll.last.el.nativeElement.querySelectorAll('ul li');
      }

      if(this.lyricRefs.length){
        console.log('接受多播的值lineNum',lineNum);
        this.currentLineNum = lineNum;
        //播放行数大于第三行 才开始滚动
        if(lineNum > startLine){
          const targetLine =this.lyricRefs[lineNum  -startLine];
          if(targetLine){
            this.wyScroll.last.scrollToElement(targetLine);
          }
        }else{
          this.wyScroll.last.scrollTo(0,0);
        }

      }
    })
  }

 /**
   * 滚动到当前歌曲
   *  obj.offsetTop 指 obj 距离上方或上层控件的位置，整型，单位像素。

      obj.offsetLeft 指 obj 距离左方或上层控件的位置，整型，单位像素。

      obj.offsetWidth 指 obj 控件自身的宽度，整型，单位像素。

      obj.offsetHeight 指 obj 控件自身的高度，整型，单位像素
   */
  private scrollToCurrent(speed = 300) {
   console.log("this.wyScroll.first.el",this.wyScroll.first.el.nativeElement);
   const songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll('ul li');

   if(songListRefs.length){
    const currentLi = <HTMLElement>songListRefs[this.currentIndex || 0];
    const offsetTop = currentLi.offsetTop;
    const liOffsetHeight = currentLi.offsetHeight;
     console.log("scrollY",this.scrollY);
     console.log("offsetTop",offsetTop);
     console.log("liOffsetHeight",liOffsetHeight);
    if((offsetTop-Math.abs(this.scrollY)) > liOffsetHeight * 4 || offsetTop <Math.abs(this.scrollY)){

      this.wyScroll.first.scrollToElement(currentLi,speed,false,false);
    }
  }
  }

  ngOnInit(): void {
  }

}
