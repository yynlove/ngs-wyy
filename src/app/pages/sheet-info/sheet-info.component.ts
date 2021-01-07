import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { SimpleOuterSubscriber } from 'rxjs/internal/innerSubscribe';
import { map, takeUntil } from 'rxjs/internal/operators';
import { Song, SongSheet } from 'src/app/services/data-types/common.type';
import { SongService } from 'src/app/services/song.service';
import { AppStoreModule } from 'src/app/store';
import { SetModalType } from 'src/app/store/actions/member-action';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';
import { getCurrentSong, getPlayer } from 'src/app/store/selectors/player.selector';
import { findIndex } from 'src/app/util/array';

@Component({
  selector: 'app-sheet-info',
  templateUrl: './sheet-info.component.html',
  styleUrls: ['./sheet-info.component.less']
})
export class SheetInfoComponent implements OnInit ,OnDestroy{

  sheetInfo :SongSheet;

  description = {
    short:'',
    long:'',
  }
  controlDesc = {
    isExpend:false,
    label:'展开',
    isconCls:'down'
  }

  currentSong : Song;
  private destroy$ = new Subject<void>();
  currentIndex:number = -1;

  constructor(private route:ActivatedRoute,
    private store$:Store<AppStoreModule>,
    private songServie :SongService,
    private batchActionsService:BatchActionsService,
    private nzMessageService:NzMessageService) {
    this.route.data.pipe(map(res => res.sheetInfo)).subscribe(res=>{
      this.sheetInfo = res;
      if(res.description){
        this.changeDesc(res.description);
      }
    });
    this.listenCurrent();
   }

  //监听当前播放歌曲
  listenCurrent() {
    this.store$.pipe(select(getPlayer),select(getCurrentSong),takeUntil(this.destroy$)).subscribe(song =>{
      this.currentSong = song;
      if(song){
        this.currentIndex = findIndex(this.sheetInfo.tracks,song);
      }else{
        this.currentIndex = -1;
      }
    });
  }



   //介绍和详情 是否显示简略
   changeDesc(desc: string) {
    if(desc.length < 99){
      this.description = {
        short:this.replaceBr('<b>介绍：</b>'+ desc),
        long:''
     }
    }else{
      this.description = {
         short: this.replaceBr('<b>介绍：</b>'+desc.slice(0,99)+'...'),
         long: this.replaceBr('<b>介绍：</b>'+desc)
      }
    }
  }


  private replaceBr(str:string):string{
    return str.replace(/\n/g,'<br/>');
  }

  //点击是否展开或收起
  toggleDesc(){
    this.controlDesc.isExpend = !this.controlDesc.isExpend;

    if(this.controlDesc.isExpend){
      this.controlDesc.label = '收起';
      this.controlDesc.isconCls = 'up';
    }else{
      this.controlDesc.label = '展开';
      this.controlDesc.isconCls = 'down';
    }
  }


  //添加歌单到播放列表
  onAddSongs(songs:Song[],isPlay= false){

    if(songs.length){
      this.songServie.getSongList(songs).subscribe(list=>{
        if(isPlay){
          this.batchActionsService.selectPlayList({list,index:0})
        }else{
          this.batchActionsService.insertSongs(list);
        }
      })
    }
  }


  //添加歌曲到播放列表
  onAddSong(song:Song,isPlay = false){

    if(!this.currentSong || this.currentSong.id !== song.id){
      //获取歌曲的url 并添加到播放歌曲列表
      this.songServie.getSongList(song).subscribe(list =>{
        if(list.length){
          this.batchActionsService.insertSong(list[0],isPlay);
        }else{
          this.nzMessageService.warning('无url');
        }
      })
    }

  }


  //发射值并结束
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
  }



  onLikeSong(id:number){
    console.log(id);
    this.batchActionsService.likeSong(id.toString());

  }



}
