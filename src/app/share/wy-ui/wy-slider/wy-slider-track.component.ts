import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { WySliderStyle } from './wy-slider-type';

@Component({
  selector: 'app-wy-slider-track',
  template: `<div class="wy-slider-track" [class.buffer]="wyBuffer" [ngStyle]="style"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WySliderTrackComponent implements OnInit, OnChanges {


  @Input() wyVertical = false;
  @Input() wyLength: number;
  @Input() wyBuffer = false; // 是否是缓冲条

  style: WySliderStyle = {};
  constructor() { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.wyLength){
      if (this.wyVertical){
        this.style.height = this.wyLength + '%';
        this.style.left = null;
        this.style.width = null;
      }else{
        this.style.bottom = null;
        this.style.height = null;
        this.style.width = this.wyLength + '%';
      }
    }

  }

  ngOnInit(): void {
  }

}
