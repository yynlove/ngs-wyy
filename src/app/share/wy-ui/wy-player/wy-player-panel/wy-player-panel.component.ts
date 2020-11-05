import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Song } from 'src/app/services/data-types/common.type';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit,OnChanges {

  @Input() songList : Song[];
  @Input() currentSong : Song;
  @Input() currentIndex : number;
  @Input() show:boolean;

  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();
  constructor() { }



  /**
   * 监听Input的变化
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['songList']){
      console.log('songList',this.songList);
    }

    if(changes['currentSong']){
      console.log('currentSong',this.songList);

    }

  }

  ngOnInit(): void {
  }

}
