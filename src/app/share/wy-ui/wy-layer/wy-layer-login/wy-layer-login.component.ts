import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
export class WyLayerLoginComponent implements OnInit {

  @Output() onChangeModalTypes = new EventEmitter<string | void>();

  @Output() onLogin = new EventEmitter<LoginParams>();

  formModal:FormGroup;
  constructor(private fb:FormBuilder) {
    this.formModal = this.fb.group({
      phone:['',[Validators.required,Validators.pattern(/^1\d{10}$/)]],
      password:['',[Validators.required,Validators.minLength(6)]],
      remember:[false]
    })
  }

  ngOnInit(): void {
  }


  onSubmit(){
    if(this.formModal.valid){
      this.onLogin.emit(this.formModal.value);
    }
  }

}
