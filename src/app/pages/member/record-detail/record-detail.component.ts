import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/internal/operators';
import { Song } from 'src/app/services/data-types/common.type';
import { RecordVal, User } from 'src/app/services/data-types/member.type';
import { MemberServices, RecordType } from 'src/app/services/member.service';
import { SheetService } from 'src/app/services/sheet.service';
import { SongService } from 'src/app/services/song.service';
import { AppStoreModule } from 'src/app/store';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { getCurrentSong, getPlayer } from 'src/app/store/selectors/player.selector';
import { findIndex } from 'src/app/util/array';

@Component({
  selector: 'app-record-detail',
  templateUrl: './record-detail.component.html',
  styles: [`.record-detail .page-wrap { padding: 40px; }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordDetailComponent implements OnInit,OnDestroy {


  //用户
  user:User;
  //历史播放记录
  records:RecordVal[];
  //播放记录类型 所有时间和最近一周
  recordType:RecordType;
  currentIndex = -1;
  private currentSong :Song;

  //销毁主题 使用takeUtil 发射值 销毁订阅当前歌曲
  private destroy$ = new Subject();

  constructor( private route :ActivatedRoute,
    private batchActionsService : BatchActionsService,
    private memberService :MemberServices,
    private songServie :SongService,
    private nzMessageService :NzMessageService,
    private store$ :Store<AppStoreModule>,
    private cdr:ChangeDetectorRef) { 
      this.route.data.pipe(map(res =>res.user),takeUntil(this.destroy$)).subscribe(([user,userRecord]) =>{
        this.user = user;
        this.records = userRecord;
        
        this.listenRecords();
      })
     
    
  }

  ngOnInit(): void {
  }

   //页面销毁时，发射一个退出订阅当前歌曲的流 
   ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  /**
   * 设置当前播放歌曲索引
   */ 
  listenRecords() {
    this.store$.pipe(select(getPlayer),select(getCurrentSong)).subscribe(song =>{
      this.currentSong = song;
      if(song){
       const songs = this.records.map(item => item.song);
       this.currentIndex = findIndex(songs,song); 
    
      }else{
        this.currentIndex = -1;
      }
      this.cdr.markForCheck();
    })

  }



  onChangeType(type:RecordType){
    if(this.recordType !== type){
      this.recordType = type;
      this.memberService.getUserRecord(this.user.profile.userId.toString(),type).subscribe(res => {
        this.records = res;
        const songs = this.records.map(item => item.song);
        this.currentIndex = findIndex(songs,this.currentSong); 
        this.cdr.markForCheck();
      })
    }
  }

  onAddSong([song,isPlay]){
    
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

}
