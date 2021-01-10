import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { interval } from 'rxjs';
import { take } from 'rxjs/internal/operators';
import { MemberServices } from 'src/app/services/member.service';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';

@Component({
  selector: 'app-wy-layer-register',
  templateUrl: './wy-layer-register.component.html',
  styleUrls: ['./wy-layer-register.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerRegisterComponent implements OnInit {


  @Output() onChangeModalTypes = new EventEmitter<string>();

  formModel:FormGroup;
  timing:number;
  constructor(
    private fb:FormBuilder,
    private memberService:MemberServices,
    private messageService:NzMessageService
    ) {
    this.formModel = this.fb.group({
      phone:['',[Validators.required,Validators.pattern(/^1\d{10}$/)]],
      password:['',[Validators.required,Validators.minLength(6)]],
    })
   }

  ngOnInit(): void {
  }


  onSubmit(){
    if(this.formModel.valid){
      this.setTime();
    }
  }
  setTime() {

    this.memberService.sendCode(this.formModel.value.phone).subscribe(res =>{
      this.timing = 60;
      interval(1000).pipe(take(60)).subscribe(() => {
        this.timing--;
        console.log('this.timing',this.timing);

      });
    },error=>{
      this.messageService.error(error.massage);
    })

  }

}
