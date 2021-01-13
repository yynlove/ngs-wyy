

import { createAction, props } from '@ngrx/store';
import { Song } from 'src/app/services/data-types/common.type';
import { PlayMode } from 'src/app/share/wy-ui/wy-player/player-type';
import { CurrentActions } from '../reducers/player.reducer';

// state 设置动作
export const SetPlaying = createAction('[player] Set playing', props<{playing: boolean}>());
export const SetPlayList = createAction('[player] Set playList', props<{playList: Song[]}>());
export const SetSongList = createAction('[player] Set songList', props<{songList: Song[]}>());
export const SetPlayMode = createAction('[player] Set playMode', props<{playMode: PlayMode}>());
export const SetCurrentIndex = createAction('[player] Set currentIndex', props<{currentIndex: number}>());
export const SetCurrentAction = createAction('[player] Set currentAction', props<{currentAction: CurrentActions}>());
