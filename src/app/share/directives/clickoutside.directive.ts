import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, EventEmitter, Inject, Input, OnChanges, Output, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appClickoutside]'
})
export class ClickoutsideDirective implements OnChanges {

  private handleClick : () =>void;
  @Input() bindFlag= false;
  @Output() onClickOutSide = new EventEmitter<void>();

  constructor(private el:ElementRef,private rd: Renderer2,@Inject(DOCUMENT) private doc:Document) {
    console.log('le>',el);
   }
   ngOnChanges(changes: SimpleChanges): void {
    if (changes['bindFlag'] && !changes['bindFlag'].firstChange) {
      if (this.bindFlag) {
        this.handleClick = this.rd.listen(this.doc, 'click', evt => {
          // console.log('doc click');
          const isContain = this.el.nativeElement.contains(evt.target);
          if (!isContain) {
            this.onClickOutSide.emit();
          }
        });
      }else {
        this.handleClick();
      }
    }
  }


}
