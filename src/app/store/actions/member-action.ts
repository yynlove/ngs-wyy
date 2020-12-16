

import { createAction, props } from '@ngrx/store';
import { ModalTypes } from '../reducers/member.reducer';

//state 设置动作
export const SetModaalVisible = createAction('[member] Set modal visible',props<{modalVisible:boolean}>());
export const SetModalType = createAction('[member] Set modal type',props<{modalType:ModalTypes}>());
