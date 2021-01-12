import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-wy-check-code',
  templateUrl: './wy-check-code.component.html',
  styleUrls: ['./wy-check-code.component.less']
})
export class WyCheckCodeComponent implements OnInit,OnChanges {

  phoneHideStr = '';
  
  //是否显示验证码不通过 false 时显示
  showErrorTip:boolean;

  //验证是否通过
  @Input() checkPass:boolean;

  //倒计时
  @Input() timing:number;
  //发射验证码事件
  @Output() onCheckCode = new EventEmitter<number>();
  //发射重新发送验证码事件
  @Output() onReatSendCode = new EventEmitter<void>();
  //发射校验手机号是否已存在
  @Output() onCheckExist = new EventEmitter<void>();
  //是否重新发送验证码
  showRepeatBtn:boolean;

  @Input()
  set phone(phone:string){
    const arr = phone.split('');
    arr.splice(3,4,'****');
    this.phoneHideStr = arr.join('');
  }
  get phone() {
    return this.phoneHideStr;
  }




  formModel :FormGroup;
  constructor(private fb:FormBuilder) {
      this.formModel = this.fb.group({
        code :['',[Validators.required,Validators.pattern(/\d{4}/)]],
      });

    //检测所有值是否通过了有效性检查  
    const codeControl =  this.formModel.get('code');
    codeControl.statusChanges.subscribe(status =>{
      if(status === 'VALID'){
          this.onCheckCode.emit(this.formModel.value.code);
      }
    })    
   }


  ngOnChanges(changes: SimpleChanges): void {
   if(changes['timing']){
      this.showRepeatBtn = this.timing <= 0;
   }
   if(changes['checkPass'] && !changes['checkPass'].firstChange){
     this.showErrorTip = !this.checkPass;
   }

  }

  ngOnInit(): void {
  }

  onSubmit(){
    //表单有效，验证码验证通过 检测账户是否已存在
    if(this.formModel.valid && this.checkPass){
       this.onCheckExist.emit();
    }
  }
}
