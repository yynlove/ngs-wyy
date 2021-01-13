import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { interval } from 'rxjs';
import { take } from 'rxjs/internal/operators';
import { MemberServices } from 'src/app/services/member.service';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';


enum Exist {
  '存在' = 1,
  '不存在' = -1
}

@Component({
  selector: 'app-wy-layer-register',
  templateUrl: './wy-layer-register.component.html',
  styleUrls: ['./wy-layer-register.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class WyLayerRegisterComponent implements OnInit {




  @Output() onRegister = new EventEmitter<number>();

  @Output() onChangeModalTypes = new EventEmitter<string>();
  // 验证码是否验证通过
  checkPass: string | boolean = '';
  // 表单数据
  formModel: FormGroup;
  // 倒计时
  timing: number;
  // 是否显示密码
  showCode = false;
  constructor(
    private fb: FormBuilder,
    private memberService: MemberServices,
    private messageService: NzMessageService,
    private cdr: ChangeDetectorRef
    ) {
    this.formModel = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
   }

  ngOnInit(): void {
  }


  onSubmit(){
    if (this.formModel.valid){
      this.setCode();
    }
  }
  setCode() {
    this.memberService.sendCode(this.formModel.value.phone).subscribe(res => {
      this.timing = 15;
      if (!this.showCode){
        this.showCode = true;
      }
      this.cdr.markForCheck();
      interval(1000).pipe(take(15)).subscribe(() => {
        this.timing--;
        this.cdr.markForCheck();

      });
    }, error => {
      this.messageService.error(error.massage || '失败');
    });
  }

  changeType(type = ModalTypes.Default){
    this.onChangeModalTypes.emit(type);
    this.showCode = false;
    this.formModel.reset();
  }

  // 校验验证码
  onCheckCode(code: number){
    console.log('1111');

    this.memberService.checkCode(Number(this.formModel.value.phone), code).subscribe(res => {
      this.checkPass = true;
    }, error => {
      this.checkPass = false;
    }, () => this.cdr.markForCheck());
  }


  /**
   * 检查账户是否已存在
   */
  onCheckExist(){
    const phone = Number(this.formModel.value.phone);
    this.memberService.checkExist(phone).subscribe(res => {

      if (Exist[res] === '存在') {
        this.messageService.error('账号已存在，可直接登陆');
        this.changeType(ModalTypes.LoginByPhone);
      } else {
        this.onRegister.emit(phone);
      }
    });
  }

}
