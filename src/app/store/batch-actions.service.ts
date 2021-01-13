import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { timer } from 'rxjs';
import { AppStoreModule } from '.';
import { Song } from '../services/data-types/common.type';
import { findIndex, shuffle } from '../util/array';
import { SetLikeId, SetModaalVisible, SetModalType } from './actions/member-action';
import { SetCurrentAction, SetCurrentIndex, SetPlayList, SetSongList } from './actions/palyer-action';
import { MemberState, ModalTypes } from './reducers/member.reducer';
import { CurrentActions, PlayState } from './reducers/player.reducer';
import { getModal } from './selectors/Menber.selector';
import { getPlayer } from './selectors/player.selector';


@Injectable({
  providedIn: AppStoreModule
})
export class BatchActionsService {


  private playerState: PlayState;

  private menberState: MemberState;

  constructor(    // 注入Store
    private store$: Store<AppStoreModule>) {
    this.store$.pipe(select(getPlayer)).subscribe(res => this.playerState = res);
    this.store$.pipe(select(getModal)).subscribe(res => this.menberState = res);
  }


  selectPlayList({list, index}){

      // 执行三个动作
      this.store$.dispatch(SetSongList({ songList: list }));
      // 判断是否是随机模式播放
      let trueIndex = index;
      let trueList = list.slice();
      if (this.playerState.playMode.type === 'random'){
        // 打乱顺序
        trueList = shuffle(list || []);
        // 查找索引
        trueIndex = findIndex(trueList, list[trueIndex]);
      }
      this.store$.dispatch(SetPlayList({ playList: trueList }));
      this.store$.dispatch(SetCurrentIndex({ currentIndex: trueIndex }));
      this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Play }));

  }


    // 添加歌曲
    insertSong(song: Song, isPlay: boolean) {
      const songList = this.playerState.songList.slice();
      let playList = this.playerState.playList.slice();
      let insertIndex = this.playerState.currentIndex;
      const pIndex = findIndex(playList, song);
      if (pIndex > -1) {
        // 歌曲已经存在
        if (isPlay) {
          insertIndex = pIndex;
        }
      } else {
        songList.push(song);
        if (isPlay) {
          insertIndex = songList.length - 1;
        }
  
        if (this.playerState.playMode.type === 'random') {
          playList = shuffle(songList);
        } else {
          playList.push(song);
        }
  
        this.store$.dispatch(SetSongList({ songList }));
        this.store$.dispatch(SetPlayList({ playList }));
      }
  
      if (insertIndex !== this.playerState.currentIndex) {
        this.store$.dispatch(SetCurrentIndex({ currentIndex: insertIndex }));
        this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Play }));
      } else {
        this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Add }));
      }
    }
  
  
    // 添加多首歌曲
    insertSongs(songs: Song[]) {
      let songList = this.playerState.songList.slice();
      let playList = this.playerState.playList.slice();
      const validSongs = songs.filter(item => findIndex(playList, item) === -1);
      if (validSongs.length) {
        songList = songList.concat(validSongs);
        let songPlayList = validSongs.slice();
        if (this.playerState.playMode.type === 'random') {
          songPlayList = shuffle(songList);
        }
        playList = playList.concat(songPlayList);
        this.store$.dispatch(SetSongList({ songList }));
        this.store$.dispatch(SetPlayList({ playList }));
      }
      this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Add }));
    }
    
  // 删除歌曲
  deleteSong(song: Song){
    const sList = this.playerState.songList.slice();
    const pList = this.playerState.playList.slice();
    let cIndex = this.playerState.currentIndex;

    const sIndex = findIndex(sList, song);
    sList.splice(sIndex, 1);
    const pIndex =  findIndex(pList, song);
    pList.splice(pIndex, 1);

    if (cIndex > pIndex || cIndex === pList.length){
      cIndex --;
    }

    this.store$.dispatch(SetSongList({songList: sList}));
    this.store$.dispatch(SetPlayList({playList: pList}));
    this.store$.dispatch(SetCurrentIndex({currentIndex: cIndex}));
    this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Delete }));
  }

  // 清空歌曲
  clearSong(){
    this.store$.dispatch(SetSongList({songList: []}));
    this.store$.dispatch(SetPlayList({playList: []}));
    this.store$.dispatch(SetCurrentIndex({currentIndex: -1}));
    this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Clear }));
  }


  // 控制登录面板组件显示
  controlModal(modalVisible = true, modalType?: ModalTypes){
    if (modalType){
      this.store$.dispatch(SetModalType({modalType}));
    }
    this.store$.dispatch(SetModaalVisible({modalVisible}));
    // 关闭弹窗 将其设置为默认
    if (!modalVisible){
      timer(500).subscribe(() =>   this.store$.dispatch(SetModalType({modalType: ModalTypes.Default})));
    }
  }


  /**
   *
   * @param id 收藏歌曲
   */
  likeSong(id: string){
    this.store$.dispatch(SetModalType({modalType: ModalTypes.Like}));
    this.store$.dispatch(SetLikeId({likeId: id}));
  }

}
