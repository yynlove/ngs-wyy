import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ShareParams } from 'src/app/services/member.service';
import { ShareInfo } from 'src/app/store/reducers/member.reducer';

const MAX_MSG = 140;

@Component({
  selector: 'app-wy-layer-share',
  templateUrl: './wy-layer-share.component.html',
  styleUrls: ['./wy-layer-share.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerShareComponent implements OnInit {

  // 信息
  @Input() shareInfo: ShareInfo;
  // 关闭窗口
  @Output() onCancel = new EventEmitter<void>();

  @Output() onShare = new EventEmitter<ShareParams>();
  // 输入msg的字数
  surplusMsgCount = MAX_MSG;

  formModel: FormGroup;

  constructor() {
    this.formModel = new FormGroup({
      msg: new FormControl('', Validators.maxLength(MAX_MSG))
    });
    this.formModel.get('msg').valueChanges.subscribe(msg => {
      this.surplusMsgCount = MAX_MSG - msg.length;
    });

   }

  ngOnInit(): void {
  }


  onSubmit(){
    if (this.formModel.valid){
      this.onShare.emit({
        id: this.shareInfo.id,
        type: this.shareInfo.type,
        msg: this.formModel.value.msg
      });
    }
  }

}
