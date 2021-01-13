import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appImgDefualt]'
})
export class ImgDefualtDirective {

  constructor() { }

  /**
   * 禁止拖拽图片打开 指令
   * @param event
   */
  @HostListener('mousedown', ['$event']) onmousedown(event){
    // 禁止默认事件
    event.preventDefault();
  }
}
