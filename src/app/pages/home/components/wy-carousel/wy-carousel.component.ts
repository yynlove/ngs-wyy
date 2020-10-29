import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-wy-carousel',
  templateUrl: './wy-carousel.component.html',
  styleUrls: ['./wy-carousel.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyCarouselComponent implements OnInit {
  //组件传进来的值
  @Input() activeIndex=0;
  //组件传出去的值 事件发射器可用(changeSlide) 方法调用 
  @Output() changeSlide = new EventEmitter<'pre' |  'next'>();

  //Dot渲染模板
  @ViewChild('dot',{static:true}) dotRef:TemplateRef<any>


  constructor() { }

  /**
   * 点击上一页 和下一页图片 发射出去pre 或next 值
   * @param type 本例中发射出去pre或next两个参数
   */
  onChangeSlide(type:'pre' |  'next'){
    this.changeSlide.emit(type);
  }

  ngOnInit(): void {
  }

}
