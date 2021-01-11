import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-wy-check-code',
  templateUrl: './wy-check-code.component.html',
  styleUrls: ['./wy-check-code.component.less']
})
export class WyCheckCodeComponent implements OnInit {

  phoneHideStr = '';

  @Input() timing:boolean;

  @Input()
  set phone(phone:string){
    const arr = phone.split('');
    arr.splice(3,4,'****');
    this.phoneHideStr = arr.join('');
  }

  constructor() { }

  ngOnInit(): void {
  }

}
