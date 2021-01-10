import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/internal/operators';
import { Singer, SingerDetail, Song } from 'src/app/services/data-types/common.type';
import { MemberServices } from 'src/app/services/member.service';
import { SongService } from 'src/app/services/song.service';
import { AppStoreModule } from 'src/app/store';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { getCurrentSong, getPlayer } from 'src/app/store/selectors/player.selector';
import { findIndex } from 'src/app/util/array';

@Component({
  selector: 'app-singer-detail',
  templateUrl: './singer-detail.component.html',
  styleUrls: ['./singer-detail.component.less']
})
export class SingerDetailComponent implements OnInit,OnDestroy {

  singerDetail :SingerDetail;

  currentSong:Song;
  private destroy$ = new Subject<void>();
  currentIndex:number = -1;
  simSingers:Singer[];

  hasLiked:boolean = false;

  constructor(private route:ActivatedRoute,
    private store$:Store<AppStoreModule>,
    private songServie :SongService,
    private batchActionsService:BatchActionsService,
    private nzMessageService:NzMessageService,
    private memberService :MemberServices) {
    this.route.data.pipe(map(res =>res.singerDetail)).subscribe(([singerDetail,simSingers]) =>{
      this.singerDetail = singerDetail;
      this.simSingers = simSingers;
      this.listenCurrent();
    })

   }

  ngOnInit(): void {
  }
 //发射值并结束
 ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}


   //监听当前播放歌曲
   listenCurrent() {
    this.store$.pipe(select(getPlayer),select(getCurrentSong),takeUntil(this.destroy$)).subscribe(song =>{
      this.currentSong = song;
      console.log('this.currentSong',this.currentSong);
      if(song){
        this.currentIndex = findIndex(this.singerDetail.hotSongs,song);
      }else{
        this.currentIndex = -1;
      }
    });
  }



  onAddSongs(songs : Song[],isPlay= false){
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


  /**
   * 收藏歌手
   */
  onLikeSinger(id:number){
    let typeInfo ={ type:1,msg:'收藏'}
    if(this.hasLiked){
      typeInfo ={ type:2,msg:'取消收藏'}
    }

    this.memberService.likeSinger(id,typeInfo.type).subscribe(res=>{
      this.hasLiked = !this.hasLiked;
      this.nzMessageService.create('success',typeInfo.msg+'成功');
    },err=>{
      this.nzMessageService.create('error',err.mgs || typeInfo.msg+'失败');
    })

  }

}
