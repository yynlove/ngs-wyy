import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, merge, pluck, takeUntil, tap } from 'rxjs/internal/operators';
import { sliderEvent } from './wy-slider-helper';
import { SliderEventObserverCOnfig } from './wy-slider-type';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation:ViewEncapsulation.None,
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class WySliderComponent implements OnInit {

  private sliderDom :HTMLDivElement;

  @Input() wyVertical = false;

  @ViewChild('wySlider' , { static: true}) private wySlider : ElementRef;

  private dragStarts$ :Observable<number>;
  private dragMove$ :Observable<number>;
  private dragEnd$ :Observable<Event>;

  constructor(@Inject(DOCUMENT) private doc :Document) { }

  ngOnInit() {
    this.sliderDom = this.wySlider.nativeElement;
    console.log('el:',this.wySlider.nativeElement);
    this.createDragginObervables();
  }

  private createDragginObervables(){
    //纵向或横向滑条
    const orientField = this.wyVertical?'pageY':'pageX';

    const mouse :SliderEventObserverCOnfig ={
      start:'mousedown',
      move:'mousemove',
      end:'mouseup',
      //判断所属类型
      filter:(e:MouseEvent)=>e instanceof MouseEvent,
      piuckKey:[orientField]
    };

    const touch :SliderEventObserverCOnfig={
      start:'touchstart',
      move:'touchmove',
      end:'touchend',
      filter:(e:TouchEvent)=>e instanceof TouchEvent,
      piuckKey:['touches','0',orientField]
    };

    [mouse,touch].forEach(source => {
      const {start,move,end,filter:filterFunc,piuckKey}= source;
      source.startPluck$  = fromEvent(this.sliderDom,start)
      .pipe(
        filter(filterFunc),
        tap(sliderEvent),
        pluck(...piuckKey),
        map((position:number) =>this.findCloseValue(position)),
      );

      source.end$ = fromEvent(this.doc,end);

      source.moveResolved$ = fromEvent(this.doc,move).pipe(
        filter(filterFunc),
        tap(sliderEvent),
        pluck(...piuckKey),
        distinctUntilChanged(),
        map((position:number) =>this.findCloseValue(position)),
        takeUntil(source.end)
      );
    });

      this.dragStarts$ = merge(mouse.startPluck$,touch.startPluck$);
      this.dragMove$ = merge(mouse.moveResolved$,touch.moveResolved$);
      this.dragEnd$ = merge(mouse.end$,touch.end$);
  }

}
