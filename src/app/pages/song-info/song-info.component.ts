import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/internal/operators';
import { Song } from 'src/app/services/data-types/common.type';
import { SongService } from 'src/app/services/song.service';
import { BaseLyricLine, WyLycir } from 'src/app/share/wy-ui/wy-player/wy-player-panel/WyLyric';
import { AppStoreModule } from 'src/app/store';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { getCurrentSong, getPlayer } from 'src/app/store/selectors/player.selector';

@Component({
  selector: 'app-song-info',
  templateUrl: './song-info.component.html',
  styleUrls: ['./song-info.component.less']
})
export class SongInfoComponent implements OnInit, OnDestroy {

  song: Song;
  lyric: BaseLyricLine[];

  controlLyric = {
    isExpend: false,
    label: '展开',
    isconCls: 'down'
  };
  currentSong: Song;
  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private store$: Store<AppStoreModule>,
              private songServie: SongService,
              private batchActionsService: BatchActionsService,
              private nzMessageService: NzMessageService) {
    this.route.data.pipe(map(res => res.songInfo)).subscribe(([song, lyric]) => {
      this.song = song;
      this.lyric = new WyLycir(lyric).lines;
      this.listenCurrent();
    });
  }


  ngOnInit(): void {
  }

   // 发射值并结束
   ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }



  toggleLyric(){
    this.controlLyric.isExpend = !this.controlLyric.isExpend;

    if (this.controlLyric.isExpend){
      this.controlLyric.label = '收起';
      this.controlLyric.isconCls = 'up';
    }else{
      this.controlLyric.label = '展开';
      this.controlLyric.isconCls = 'down';
    }
  }


   // 监听当前播放歌曲
   listenCurrent() {
    this.store$.pipe(select(getPlayer), select(getCurrentSong), takeUntil(this.destroy$)).subscribe(song => {
      this.currentSong = song;
      console.log('this.currentSong', this.currentSong);

    });
  }

  onAddSong(song: Song, isPlay = false){

    if (!this.currentSong || this.currentSong.id !== song.id){
      // 获取歌曲的url 并添加到播放歌曲列表
      this.songServie.getSongList(song).subscribe(list => {
        if (list.length){
          this.batchActionsService.insertSong(list[0], isPlay);
        }else{
          this.nzMessageService.warning('无url');
        }
      });
    }

  }



}
