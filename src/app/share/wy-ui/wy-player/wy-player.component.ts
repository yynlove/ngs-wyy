import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Song } from 'src/app/services/data-types/common.type';
import { AppStoreModule } from 'src/app/store';
import { SetCurrentIndex } from 'src/app/store/actions/palyer-action';
import { getCurrentIndex, getCurrentSong, getPlayer, getPlayList, getPlayMode, getSongList } from 'src/app/store/selectors/player.selector';
import { PlayMOde } from './player-type';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {

  sliderValue = 35;
  bufferOffset = 70;

  songList : Song[];
  playList : Song[];
  currentIndex : number;
  playMode : null;
  currentSong: Song;
  //歌曲总时长
  duration:number;
  //歌曲当前播放的时间
  currentTime: number;

  //播放状态
  playing = false;
  //是否可以播放
  songReady = false;


  @ViewChild('audio',{ static : true }) private audio :ElementRef;
  private audioEl : HTMLAudioElement;

  constructor(
    private store$ : Store<AppStoreModule>
  ) {
    const appStore$ = this.store$.pipe(select(getPlayer));
    //监听状态管理的变化
    appStore$.pipe( select(getSongList) ).subscribe(list => this.wactchList(list,'songList'));
    appStore$.pipe( select(getPlayList) ).subscribe(list => this.wactchList(list,'playList'));
    appStore$.pipe( select(getCurrentIndex) ).subscribe(index => this.wactchCurrentIndex(index));
    appStore$.pipe(select( getPlayMode) ).subscribe(mode => this.watchPlayMode(mode));
    appStore$.pipe(select( getCurrentSong) ).subscribe(song => this.watchCurrentSong(song));
    //appStore$.pipe(select( getCurrentAction) ).subscribe(action => this.watchCurrentAction(action));


    // const stateArr =[{
    //   type : getSongList,
    //   cb : list => this.wactchList(list,'songList')
    // },{
    //   type : getPlayList,
    //   cb : list => this.wactchList(list,'playList')
    // },{
    //   type : getCurrentIndex,
    //   cb : index => this.wactchCurrentIndex(index)
    // }];
  }


  ngOnInit(): void {
    //赋值
    console.log('audioEL',this.audio.nativeElement);
    this.audioEl = this.audio.nativeElement;
  }

  /**
   *
   * 绑定数据
   */
  private wactchList(list: Song[],type:string){
    console.log("player-"+type+">>>",list);
    this[type] = list;
  }

  private wactchCurrentIndex(index: number){
    this.currentIndex = index;
  }
  watchPlayMode(mode: PlayMOde): void {

  }
  watchCurrentSong(song: Song): void {
    console.log("player-song>>>",song);
    if(song){
      this.currentSong = song;
      this.duration = song.dt /1000; //毫秒换算秒
    }
  }


  /**
   * 播放/暂停
   */
  onToggle(){
    if(!this.currentSong){
      if(this.playList.length){
        //如果有歌曲 没有播放
        this.updateIndex(0);
      }
    }else{
      if(this.songReady){
        this.playing = !this.playing;
        if(this.playing){
          this.audioEl.play();
        }else{
          this.audioEl.pause();
        }
      }
    }
  }



  onPrev(index: number){
    if(!this.songReady) return;
    if(this.playList.length ===1){
      this.loop();
    }else{
      const newIndex = index <=0 ? this.playList.length -1 :index;
      this.updateIndex(newIndex);
    }

  }

  onNext(index : number){
    if(!this.songReady) return;
    if(this.playList.length ===1){
      this.loop();
    }else{
      const newIndex = index >= this.playList.length ? 0:index;
      this.updateIndex(newIndex);
    }
  }
  loop() {
   this.audioEl.currentTime = 0;
   this.play();
  }




  /**
   *
   * 当歌曲可以播放的时候就进行播放
   */
   onCanplay(){
    this.songReady = true;
    this.play();
  }
  play() {
    this.audioEl.play();
    this.playing=true;
  }



  //获取歌曲图片
  get picUrl(): string{
    return this.currentSong ? this.currentSong.al.picUrl : '//s4.music.126.net/style/web2/img/default/default_album.jpg';
  }


  //歌曲播放监听 当前时间
  onTimeUpdate(e:Event){
    this.currentTime = (<HTMLAudioElement>e.target).currentTime;
  }



  updateIndex(index: number){
    this.store$.dispatch(SetCurrentIndex({ currentIndex : index}));
    this.songReady = false;
  }
}
