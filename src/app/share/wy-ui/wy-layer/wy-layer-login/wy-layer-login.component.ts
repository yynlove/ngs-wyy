import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { codeJson } from 'src/app/util/base64';

export type LoginParams={
  phone:string,
  password:string,
  remember:boolean,
}


@Component({
  selector: 'app-wy-layer-login',
  templateUrl: './wy-layer-login.component.html',
  styleUrls: ['./wy-layer-login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerLoginComponent implements OnInit,OnChanges {

  @Input() wyRememberLogin:LoginParams;
  @Output() onChangeModalTypes = new EventEmitter<string | void>();

  @Output() onLogin = new EventEmitter<LoginParams>();

  formModel:FormGroup;
  constructor(private fb:FormBuilder) {

  }


  ngOnChanges(changes: SimpleChanges): void {

    const userLoginParams = changes['wyRememberLogin']

    if(userLoginParams){
      let phone ='';
      let password ='';
      let remember ='';
      if(userLoginParams.currentValue){
        const value = codeJson(userLoginParams.currentValue,'decode');
        phone = value.phone;
        password = value.password;
        remember = value.remember;

      }

      this.setModel({phone,password,remember});
    }
  }
  setModel(arg0: { phone: string; password: string; remember: string; }) {
    this.formModel = this.fb.group({
      phone:[arg0.phone,[Validators.required,Validators.pattern(/^1\d{10}$/)]],
      password:[arg0.password,[Validators.required,Validators.minLength(6)]],
      remember:[arg0.remember]
    })
  }

  ngOnInit(): void {
  }


  onSubmit(){
    if(this.formModel.valid){
      this.onLogin.emit(this.formModel.value);
    }
  }

}
