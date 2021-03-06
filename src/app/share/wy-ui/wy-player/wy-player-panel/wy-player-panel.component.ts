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
export class WyPlayerPanelComponent implements OnInit, OnChanges {


  // 歌曲是否播放
  @Input() playing: boolean;
  // 歌曲播放列表
  @Input() songList: Song[];
  @Input() currentSong: Song;
  currentIndex: number;
  // 歌曲列表面板是否显示
  @Input() show: boolean;

  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();
  // 删除一个歌曲
  @Output() onDeleteSong = new EventEmitter<Song>();
  // 清空歌单
  @Output() onClearSong = new EventEmitter<void>();
  @Output() onToInfo = new EventEmitter<[string, number]>();
  // 收藏歌曲
  @Output() onLikeSong = new EventEmitter<string>();
  // 分享歌曲
  @Output() onShareSong = new EventEmitter<Song>();

  // 使用viewchildren是因为 有一个歌词也需要滚动
  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;

  scrollY = 0; // 接受的bs纵轴坐标  相当于左侧滑块的偏移量

  currentLyric: BaseLyricLine[];
  // 当前播放的行
  currentLineNum: number;
  // 歌词
  private lyric: WyLycir;
  // 歌词元素list
  private lyricRefs: NodeList;

  // 第几行滚动
  private startLine = 2;

  constructor(private songService: SongService) {
  }



  /**
   * 监听Input的变化
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    // 判断歌曲的播放状态是否改变
    if (changes.playing){
      if (!changes.playing.firstChange){
        this.lyric && this.lyric.togglePlay(this.playing);

      }
    }


    if (changes.songList){
      console.log('songList', this.songList);
      // 切换歌单 肯定是0
      if (this.currentSong){
        this.updateCurrentIndex();
      }
    }

    // j监听当前播放歌曲是否改变
    if (changes.currentSong){
      // 滚动到当前歌曲
      if (this.currentSong){
        // 切换歌曲 重新获取当前索引
       this.updateCurrentIndex();
        // 切换歌词
       this.updateLyric();
       if (this.show){
          this.scrollToCurrent();
        }
      }else{
        // 重置歌词
          this.resetLyric();
      }
    }
    if (changes.show){
      if (!changes.show.firstChange && this.show){
        this.wyScroll.first.refreshScroll();
        // 刷新歌词
        this.wyScroll.last.refreshScroll();
        // 等滚动组件50ms刷新完成后在进行滚动
        // 定时器
        timer(50).subscribe(() => {
           if (this.currentSong){
            this.scrollToCurrent(0);
          }
           if (this.lyric){
            this.scrollToCurrentLyric(0);
          }

        });


      }

    }
  }


  private updateCurrentIndex(){
    this.currentIndex = findIndex(this.songList, this.currentSong);
  }
  updateLyric() {
    // 切歌时，重置歌词
    this.resetLyric();

    this.songService.getLyric(this.currentSong.id).subscribe(res => {
     // console.log("lyric",res.lyric);
      this.lyric = new WyLycir(res);
      this.currentLyric = this.lyric.lines;
     // console.log('this.currentLyric',this.currentLyric);
     // 订阅多播
      this.startLine = res.tlyric ? 1 : 2;
      this.handleLyric();

      this.wyScroll.last.scrollTo(0, 0);
      // 如果歌曲播放 歌词也要跟着播放
      if (this.playing){
        this.lyric.play();
      }
    });
  }
  // 重置歌词
  resetLyric() {
    if (this.lyric){
      this.lyric.stop();
      this.currentLineNum = 0;
      this.currentLyric = [];
      this.lyric = null;
      this.lyricRefs = null;

    }
  }

  // 播放进度条改变时跳转歌词
  seekLyric(timer: number){
    if (this.lyric){
      this.lyric.seek(timer);
    }
  }

  handleLyric() {
    this.lyric.handler.subscribe(({lineNum}) => {
      // 播放时滚动歌词面板 并设置当前播放行
      if (!this.lyricRefs){
        this.lyricRefs = this.wyScroll.last.el.nativeElement.querySelectorAll('ul li');
      }

      if (this.lyricRefs.length){
        this.currentLineNum = lineNum;
        // 播放行数大于第三行 才开始滚动
        if (lineNum > this.startLine){
         this.scrollToCurrentLyric(300);
        }else{
          this.wyScroll.last.scrollTo(0, 0);
        }

      }
    });
  }

 /**
   * 滚动到当前歌曲
   *  obj.offsetTop 指 obj 距离上方或上层控件的位置，整型，单位像素。

      obj.offsetLeft 指 obj 距离左方或上层控件的位置，整型，单位像素。

      obj.offsetWidth 指 obj 控件自身的宽度，整型，单位像素。

      obj.offsetHeight 指 obj 控件自身的高度，整型，单位像素
   */
  private scrollToCurrent(speed = 300) {
   const songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll('ul li');

   if (songListRefs.length){
    const currentLi = songListRefs[this.currentIndex || 0] as HTMLElement;
    const offsetTop = currentLi.offsetTop;
    const liOffsetHeight = currentLi.offsetHeight;
    if ((offsetTop - Math.abs(this.scrollY)) > liOffsetHeight * 4 || offsetTop < Math.abs(this.scrollY)){

      this.wyScroll.first.scrollToElement(currentLi, speed, false, false);
    }
  }
  }


  private scrollToCurrentLyric(speed = 300){
    const targetLine = this.lyricRefs[this.currentLineNum  - this.startLine];
    if (targetLine){
      this.wyScroll.last.scrollToElement(targetLine, speed, false, false);
    }
  }

  ngOnInit(): void {
  }


  toInfo(evt: MouseEvent, path: [string, number]){
    evt.stopPropagation();
    this.onToInfo.emit(path);
  }


  // 收藏歌曲
  likeSong(evt: MouseEvent, id: string){
    evt.stopPropagation();
    this.onLikeSong.emit(id);
  }

  shareSong(evt: MouseEvent, song: Song){

    evt.stopPropagation();
    this.onShareSong.emit(song);
  }

}
