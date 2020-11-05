import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { fromEvent, Subscription } from 'rxjs';
import { Song } from 'src/app/services/data-types/common.type';
import { AppStoreModule } from 'src/app/store';
import { SetCurrentIndex, SetPlayList, SetPlayMode } from 'src/app/store/actions/palyer-action';
import { getCurrentIndex, getCurrentSong, getPlayer, getPlayList, getPlayMode, getSongList } from 'src/app/store/selectors/player.selector';
import { shuffle } from 'src/app/util/array';
import { PlayMode } from './player-type';
//播放模式
const modeTypes:PlayMode[] =[{
  type:'loop',
  label: '循环'
},{
  type:'random',
  label: '随机'
},{
  type:'singleLoop',
  label: '单曲循环'
}]

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {
 //表示一个百分比
  percent = 0;
  bufferPercent = 0;

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
  //音量
  volume: number = 20;

  //是否显示音量面板
  showVolumnPanel = false;

  //是否显示歌单面板
  showPanel = false;
  //判断点击的是音量面板本身
  selfClick :boolean = false;

  //播放模式
  currentMode:PlayMode;
  //点击次数
  modeCount :number =0;

  private winClick : Subscription;

  @ViewChild('audio',{ static : true }) private audio :ElementRef;
  private audioEl : HTMLAudioElement;

  constructor(
    private store$ : Store<AppStoreModule>,
    @Inject(DOCUMENT) private doc :Document
  ) {
    const appStore$ = this.store$.pipe(select(getPlayer));
    //监听状态管理的变化
    appStore$.pipe( select(getSongList) ).subscribe(list => this.wactchList(list,'songList'));
    appStore$.pipe( select(getPlayList) ).subscribe(list => this.wactchList(list,'playList'));
    appStore$.pipe( select(getCurrentIndex) ).subscribe(index => this.wactchCurrentIndex(index));
    appStore$.pipe(select( getPlayMode) ).subscribe(mode => this.watchPlayMode(mode));
    appStore$.pipe(select( getCurrentSong) ).subscribe(song => this.watchCurrentSong(song));

  }


  ngOnInit(): void {
    //赋值
    console.log('audioEL',this.audio.nativeElement);
    this.audioEl = this.audio.nativeElement;
  }

  /**
   * 监听事件
   * 绑定数据
   */
  private wactchList(list: Song[],type:string){
    console.log("player-"+type+">>>",list);
    this[type] = list;
  }

  private wactchCurrentIndex(index: number){
    this.currentIndex = index;
  }
  watchPlayMode(mode: PlayMode): void {
    this.currentMode = mode;

    if(this.songList){
      let list = this.songList.slice();
      if(mode.type === 'random'){
        //打乱一个数组
        list = shuffle(this.songList);
        //保证当前播放的歌曲不变
        this.updateCurrentIndex(list,this.currentSong);
        //更改歌曲的播放顺序
        this.store$.dispatch(SetPlayList({playList:list}));
      }
      // console.log('suijiList',list);
    }
  }

  watchCurrentSong(song: Song): void {
    console.log("player-song>>>",song);
    if(song){
      this.currentSong = song;
      this.duration = song.dt /1000; //毫秒换算秒
    }
  }

  //播放结束
  onEnded(){
    this.playing = false;
    if(this.currentMode.type === 'singleLoop'){
      this.loop();
    }else{
      this.onNext(this.currentIndex + 1);
    }
  }


  /**
   * 随机播放更改当前歌曲的索引 保证当前歌曲不变
   * @param list
   * @param currentSong
   */
  updateCurrentIndex(list: Song[], currentSong: Song) {
    const newIndex = list.findIndex(item => item.id === currentSong.id);
    this.store$.dispatch(SetCurrentIndex({currentIndex : newIndex}));
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
   *改变播放模式
   */
  changeMode(){
    const modeType = modeTypes[ ++ this.modeCount % 3];
    //使watchPlayMode 能监听到
    this.store$.dispatch(SetPlayMode({playMode:modeType}));
  }


  /**
   * 滑动滑块 控制音量
   *
   */
  onVolumeChange(per : number){
    this.audioEl.volume = per / 100;
  }


  /**
   * 控制音量面板
   */
  toggleVolPanel(){
    //阻止冒泡
    //evt.stopPropagation();
    this.togglePanel('showVolumnPanel');

  }


  /**
   * 控制歌单面板 是否显示
   */
  toggleListPanel(){
    //有歌曲才显示
    if(this.songList.length){
      this.togglePanel('showPanel');
    }
  }


  togglePanel(type:string){
    this[type] = !this[type];
    //只要有一个存在就全局的click 事件
    if(this.showVolumnPanel || this.showPanel){
      //绑定全局的click事件
      this.bindDocumentClickListener();
    }else{
      this.unbindDocumentClickListener();
    }
  }




  unbindDocumentClickListener() {
    if(this.winClick){ //说明点击了播放器以外的地方
     this.winClick.unsubscribe();
     this.winClick = null;
    }
  }
  bindDocumentClickListener() {
    if(!this.winClick){
      this.winClick = fromEvent(this.doc,'click').subscribe(()=>{
        if(!this.selfClick){ //说明点击了播放器以外的地方
          this.showVolumnPanel = false;
          this.showPanel = false;
          this.unbindDocumentClickListener();
        }
        this.selfClick = false;
      })
    }
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


  /**
   *拖拽滑块改变位置
   * @param pre   滑块的位置
   */
  onPercentChange(pre){
    console.log("pre",pre);
    if(this.currentSong){
      this.audioEl.currentTime = this.duration * (pre / 100);
    }
  }



  //获取歌曲图片
  get picUrl(): string{
    //没有图片则给默认值
    return this.currentSong ? this.currentSong.al.picUrl : '//s4.music.126.net/style/web2/img/default/default_album.jpg';
  }


  //歌曲播放监听 当前时间
  onTimeUpdate(e:Event){
    this.currentTime = (<HTMLAudioElement>e.target).currentTime;
    //歌曲播放 更改进度条的位置
    this.percent = (this.currentTime / this.duration) * 100;
    //缓冲条的长度
    const buffered =  this.audioEl.buffered;
    if(buffered.length && this.bufferPercent <100){
      this.bufferPercent = (buffered.end(0) / this.duration) * 100;
    }
  }







  updateIndex(index: number){
    this.store$.dispatch(SetCurrentIndex({ currentIndex : index}));
    this.songReady = false;
  }



  /**
   * 通过面板改变歌曲
   */
  onChangeSong(song:Song){
    this.updateCurrentIndex(this.songList,song);
  }

}
