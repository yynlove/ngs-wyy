import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, EventEmitter, Inject, Input, OnChanges, Output, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appClickoutside]'
})
export class ClickoutsideDirective implements OnChanges {

  private handlerClick :() =>void;
  @Input() bingFlag= false;
  @Output() onClickOutSide = new EventEmitter<void>();

  constructor(private el:ElementRef,private rd: Renderer2,@Inject(DOCUMENT) private doc:Document) {
    console.log('le>',el);


   }
  ngOnChanges(changes: SimpleChanges): void {

    if(changes['bingFlag'] && !changes['bingFlag'].firstChange){
      //绑定
      console.log('doc Click');
      this.handlerClick = this.rd.listen(this.doc,'click',evt=>{
        const isContain = this.el.nativeElement.contains(evt.target);
        if(!isContain){
          this.onClickOutSide.emit();
        }
      })
    }else{
      //解绑
      this.handlerClick();
    }
  }


}
