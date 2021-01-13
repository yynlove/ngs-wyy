import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SongSheet } from 'src/app/services/data-types/common.type';
import { likeSongParams } from 'src/app/services/member.service';

@Component({
  selector: 'app-wy-layer-like',
  templateUrl: './wy-layer-like.component.html',
  styleUrls: ['./wy-layer-like.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerLikeComponent implements OnInit, OnChanges {

  // 我的歌单列表
  @Input() mySheets: SongSheet[];
  // 要收藏的歌曲id
  @Input() likeId: string;
  // 是否关了窗体
  @Input() visible = false;
  @Output() onLikeSong = new EventEmitter<likeSongParams>();

  @Output() onCreateSheet = new EventEmitter<string>();

  // 是否创建歌单
  creating = false;
  // 新建歌单表单
  formModel: FormGroup;
  constructor(private fb: FormBuilder) {
    this.formModel = this.fb.group({
      sheetName: ['', [Validators.required]],
    });
   }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visible){
      // 重置控件
      this.formModel.get('sheetName').reset();
      this.creating = false;
    }
  }

  ngOnInit(): void {
  }

  // 发射要收藏到的歌单id和 歌曲id
  onLike(id: string){
    this.onLikeSong.emit({pid: id, tracks: this.likeId});
  }

  // 提交新建表单
  onSubmit(){
    this.onCreateSheet.emit(this.formModel.value.sheetName);
  }


}
