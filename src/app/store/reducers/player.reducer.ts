
import { Action, createReducer, on } from '@ngrx/store';
import { Song } from 'src/app/services/data-types/common.type';
import { PlayMOde } from 'src/app/share/wy-ui/wy-player/player-type';
import { SetCurrentIndex, SetPlaying, SetPlayList, SetPlayMode, SetSongList } from '../actions/palyer-action';
//定义播放器需要的元数据
export type PlayState={
  //播放状态
  playing : boolean;
  //播放模式
  playMode: PlayMOde;

  //歌曲列表
  songList : Song[];
  //播放列表
  playList : Song[];

  //当前正在播放份索引
  currentIndex : number;
}

//定义初始化的state
export const initalState :PlayState={
    playing : false,
    playMode: {type : 'loop',label:'循环'},
    songList :[],
    playList :[],
    currentIndex : -1
}

//注册动作

const reducer = createReducer(
  initalState,
  //注册动作 函数 是修改一个状态
  on(SetPlaying,(state, { playing }) => ({...state,playing})),
  on(SetPlayList,(state, {playList}) => ({...state,playList})),
  on(SetSongList,(state, {songList}) => ({...state,songList})),
  on(SetPlayMode,(state, {playMode}) => ({...state,playMode})),
  on(SetCurrentIndex,(state, {currentIndex}) => ({...state,currentIndex}))
  );


export function playReducer(state : PlayState,action : Action){
  return reducer(state, action);
}
