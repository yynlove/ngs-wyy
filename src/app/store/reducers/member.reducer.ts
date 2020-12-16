
import { Action, createReducer, on } from '@ngrx/store';
import { Song } from 'src/app/services/data-types/common.type';
import { PlayCountPipe } from 'src/app/share/pipes/play-count.pipe';
import { PlayMode } from 'src/app/share/wy-ui/wy-player/player-type';
import { SetModaalVisible, SetModalType } from '../actions/member-action';
import { SetCurrentAction, SetCurrentIndex, SetPlaying, SetPlayList, SetPlayMode, SetSongList } from '../actions/palyer-action';

//定义弹窗类型
export enum ModalTypes {
  Register ='register',
  LoginByPhone = 'loginByPhone',
  Share ='share',
  Like ='like',
  Default = 'default'
}

export type MemberState ={
  modalVisible :boolean;
  modalType :ModalTypes;
}

//定义初始化的state
export const initalState :MemberState={
  modalVisible : false,
  modalType:ModalTypes.Default,

}

//注册动作

const reducer = createReducer(
  initalState,
  //注册动作 函数 是修改一个状态
  on(SetModaalVisible,(state, { modalVisible }) => ({...state,modalVisible})),
  on(SetModalType,(state, {modalType}) => ({...state,modalType})),

  );


export function memberReducer(state : MemberState,action : Action){
  return reducer(state, action);
}
