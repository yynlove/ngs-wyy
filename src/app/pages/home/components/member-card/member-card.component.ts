import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { timer } from 'rxjs';
import { User } from 'src/app/services/data-types/member.type';
import { MemberServices } from 'src/app/services/member.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.less']
})
export class MemberCardComponent implements OnInit {

  @Input() user :User;

  @Output() openModal = new EventEmitter<void>();
  constructor(private memberServices:MemberServices,
    private nzMessageService:NzMessageService) { }

  ngOnInit(): void {
  }
  //显示文本
  tooltipTitle:string='';
  //显示隐藏
  showPoint:boolean = false;
  onSignin(){
    this.memberServices.signin().subscribe(res =>{
      console.log('res',res);
      this.alertMessage('success',"签到成功");
      this.tooltipTitle ='积分 + '+res.point;
      this.showPoint = true;
      timer(1500).subscribe(()=>{
        this.showPoint = false;
        this.tooltipTitle = '';
      })
    },error=>{
        console.log('error',error);
        this.alertMessage('error',error.message|| '签到失败');
    });
  }
  alertMessage(type: string, msg: string) {
    this.nzMessageService.create(type,msg);
  }

}
