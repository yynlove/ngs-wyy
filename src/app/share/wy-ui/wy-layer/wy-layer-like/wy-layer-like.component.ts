import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { SongSheet } from 'src/app/services/data-types/common.type';
import { likeSongParams } from 'src/app/services/member.service';

@Component({
  selector: 'app-wy-layer-like',
  templateUrl: './wy-layer-like.component.html',
  styleUrls: ['./wy-layer-like.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerLikeComponent implements OnInit,OnChanges {


  @Input() mySheets :SongSheet[];

  @Input() likeId :string;

  @Output() onLikeSong = new EventEmitter<likeSongParams>();
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['mySheets']){
      console.log("mySheets",changes['mySheets'].currentValue);
    }
    if(changes['likeId']){
      console.log("likeId",this.likeId);
      
    }
  }

  ngOnInit(): void {
  }



  onLike(id:string){
    this.onLikeSong.emit({pid:id,tracks:this.likeId});
  }


}
