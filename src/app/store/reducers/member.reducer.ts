
import { Action, createReducer, on } from '@ngrx/store';
import { SetModaalVisible, SetModalType, SetUserId } from '../actions/member-action';
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
  userId: string;
}

//定义初始化的state
export const initalState :MemberState={
  modalVisible : false,
  modalType:ModalTypes.Default,
  userId:''
}

//注册动作

const reducer = createReducer(
  initalState,
  //注册动作 函数 是修改一个状态
  on(SetModaalVisible,(state, { modalVisible }) => ({...state,modalVisible})),
  on(SetModalType,(state, {modalType}) => ({...state,modalType})),
  on(SetUserId,(state, {userId}) => ({...state,userId})),
  );


export function memberReducer(state : MemberState,action : Action){
  return reducer(state, action);
}
