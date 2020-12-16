import { animate, state, style, transition, trigger,AnimationEvent } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription, timer } from 'rxjs';
import { Song } from 'src/app/services/data-types/common.type';
import { AppStoreModule } from 'src/app/store';
import { SetCurrentAction, SetCurrentIndex, SetPlayList, SetPlayMode } from 'src/app/store/actions/palyer-action';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { CurrentActions } from 'src/app/store/reducers/player.reducer';
import { getCurrentAction, getCurrentIndex, getCurrentSong, getPlayer, getPlayList, getPlayMode, getSongList } from 'src/app/store/selectors/player.selector';
import { findIndex, shuffle } from 'src/app/util/array';
import { PlayMode } from './player-type';
import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';

enum TooltopAction{
  Add = "已添加到列表",
  Play= "播放此歌曲"
}

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
  styleUrls: ['./wy-player.component.less'],
  //定义动画
  animations:[
    trigger('showHide',[
    state('show',style({bottom:0})),
    state('hide',style({bottom:-71})),
    transition('show=>hide',[animate('0.3s')]),
    transition('hide=>show',[animate('0.1s')])
  ])
]
})
export class WyPlayerComponent implements OnInit {
 //表示一个百分比
  percent = 0;
  bufferPercent = 0;

  //是否显示或隐藏播放器 动画
  showPlayer:string = 'hide';
  //是否已经锁住
  isLocked = false;
  //是否正在动画中
  animating = false;

  //操作文本提示
  currentTooltip={
    title:"",
    show:false
  }

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
  volume: number = 5;

  //是否显示音量面板
  showVolumnPanel = false;

  //是否显示歌单面板
  showPanel = false;
  //判断点击的是音量面板本身
  //selfClick :boolean = false;
  bindFlag :boolean = false;

  //播放模式
  currentMode:PlayMode;
  //点击次数
  modeCount :number =0;

  private winClick : Subscription;

  @ViewChild('audio',{ static : true }) private audio :ElementRef;
  //有显示和隐藏的动作 static为false
  @ViewChild(WyPlayerPanelComponent,{ static : false }) private playerPanel :WyPlayerPanelComponent;



  private audioEl : HTMLAudioElement;

  constructor(
    private store$ : Store<AppStoreModule>,
    @Inject(DOCUMENT) private doc :Document,
    private batchArtionsService : BatchActionsService,
    private nzModalService:NzModalService,
    private router:Router
  ) {
    const appStore$ = this.store$.pipe(select(getPlayer));
    //监听状态管理的变化
    appStore$.pipe( select(getSongList) ).subscribe(list => this.wactchList(list,'songList'));
    appStore$.pipe( select(getPlayList) ).subscribe(list => this.wactchList(list,'playList'));
    appStore$.pipe( select(getCurrentIndex) ).subscribe(index => this.wactchCurrentIndex(index));
    appStore$.pipe(select( getPlayMode) ).subscribe(mode => this.watchPlayMode(mode));
    appStore$.pipe(select( getCurrentSong) ).subscribe(song => this.watchCurrentSong(song));
    appStore$.pipe(select( getCurrentAction) ).subscribe(action => this.watchCurrentArchion(action));

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
      // console.log('suijiList',list);
      }

    }
  }

  watchCurrentSong(song: Song): void {
    //如果没有歌曲则触发错误事件
    this.currentSong = song;
    if(song){
      this.duration = song.dt /1000; //毫秒换算秒
    }
  }

  //动画结束，并判断是否需要显示文字提示
  onAnimating(event:AnimationEvent){
    this.animating = false;
    if(event.toState === 'show' && this.currentTooltip.title){
      this.showTooltip();
    }
  }


  watchCurrentArchion(currentAction:  CurrentActions): void {
    //通过状态中获取枚举 title
    const title =TooltopAction[CurrentActions[currentAction]];
    if(title){
      this.currentTooltip.title = title;
      if(this.showPlayer === 'hide'){
        this.togglePlayer('show');
      }else{
        this.showTooltip();
      }
    }
    this.store$.dispatch(SetCurrentAction({ currentAction:CurrentActions.Other }));
  }
  //显示消息 并之后延时初始化
  showTooltip() {
    this.currentTooltip.show = true;
    timer(1500).subscribe(()=>{this.currentTooltip={
      title:"",
      show:false
    }})
  }

  //播放结束
  onEnded(){
    this.playing = false;
    //单曲循环
    if(this.currentMode.type === 'singleLoop'){
      this.loop();
    }else{
      this.onNext(this.currentIndex + 1);
    }
  }

  onError(){
    this.playing= false;
    this.bufferPercent = 0;
  }


  /**
   * 随机播放更改当前歌曲的索引 保证当前歌曲不变
   * @param list
   * @param currentSong
   */
  updateCurrentIndex(list: Song[], currentSong: Song) {

    const newIndex = findIndex(list,currentSong);
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
   //歌词更新
   if(this.playerPanel){
     this.playerPanel.seekLyric(0);
   }


  }


  /**
   *改变播放模式
   */
  changeMode(){
    const modeType = modeTypes[ ++ this.modeCount % 3];
    //使watchPlayMode 能监听到
    this.store$.dispatch(SetPlayMode({playMode:modeType}));
  }

  onClickOutSide(event:HTMLElement){
    //点击删除按钮会移除html 该指令则判断点击的非播放器，因此会隐藏，取消删除时隐藏面板
    if(event.dataset.art !== 'delete'){
      this.showVolumnPanel = false;
      this.showPanel = false;
      this.bindFlag = false;
    }
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
    // if(this.showVolumnPanel || this.showPanel){
    //   //绑定全局的click事件
    //   this.bingFlag = true;
    //   //this.bindDocumentClickListener();
    // }else{
    //   //this.unbindDocumentClickListener();
    //   this.bingFlag = false;
    // }
    this.bindFlag  =(this.showVolumnPanel || this.showPanel);
  }




  // unbindDocumentClickListener() {
  //   if(this.winClick){ //说明点击了播放器以外的地方
  //    this.winClick.unsubscribe();
  //    this.winClick = null;
  //   }
  // }

  // bindDocumentClickListener() {
  //   if(!this.winClick){
  //     this.winClick = fromEvent(this.doc,'click').subscribe(()=>{
  //       if(!this.selfClick){ //说明点击了播放器以外的地方
  //         this.showVolumnPanel = false;
  //         this.showPanel = false;
  //         this.unbindDocumentClickListener();
  //       }
  //       this.selfClick = false;
  //     })
  //   }
  // }


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
      const currentTime = this.duration * (pre / 100);
      this.audioEl.currentTime = currentTime;
      if(this.playerPanel){
        this.playerPanel.seekLyric(currentTime * 1000);

      }
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





  onDeleteSong(song:Song){

    this.batchArtionsService.deleteSong(song);
  }


  onClearSong(){
    this.nzModalService.confirm({
      nzTitle:'确认清空歌单？',
      nzOnOk:() => {
        this.batchArtionsService.clearSong();
      }
    })
  }



  toInfo(path:[string,number]){
    if(path[1]){
      this.router.navigate(path);
      this.showPanel = false;
      this.showVolumnPanel  = false;

    }
  }

  togglePlayer(type:string){
    if(!this.isLocked && !this.animating){
      this.showPlayer = type;
    }
  }

}
