

import { createAction, props } from '@ngrx/store';
import { ModalTypes, ShareInfo } from '../reducers/member.reducer';

//state 设置动作
export const SetModaalVisible = createAction('[member] Set modal visible',props<{modalVisible:boolean}>());
export const SetModalType = createAction('[member] Set modal type',props<{modalType:ModalTypes}>());
export const SetUserId = createAction('[member] Set user id',props<{userId:string}>());
export const SetLikeId = createAction('[member] Set like id',props<{likeId:string}>());
export const SetShareInfo = createAction('[member] Set share info',props<{info :ShareInfo}>());