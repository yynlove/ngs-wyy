import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, AfterViewInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import MouseWheel from '@better-scroll/mouse-wheel';
BScroll.use(ScrollBar);
BScroll.use(MouseWheel);

@Component({
  selector: 'app-wy-scroll',
  template: `
    <div  class="wy-scroll" #warp>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`.wy-scroll{width:100%;height:100%};overflow:hidden`
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyScrollComponent implements OnInit,AfterViewInit,OnChanges {
  scrollToElement(...args) {
    this.bs.scrollToElement.apply(this.bs, args);
  }



  @Input() data : any[];


  //滚动面板延迟刷新的时长
  @Input() refreshDelay:number = 50;

  @Output() private onScrollEnd = new EventEmitter<number>();
  private bs :BScroll;

  @ViewChild('warp',{static:true}) private warpRef:ElementRef;


  constructor(readonly el:ElementRef) { }


  ngOnChanges(changes: SimpleChanges): void {
    /**songList发生变化时 刷新滚动面板 */
    if(changes['data']){
      this.refreshScroll();
    }


  }

  ngAfterViewInit(): void {
    console.log('滚动高度',this.warpRef.nativeElement.offsetHeight)
    //设置滑动组件作用的外层组件
    this.bs = new  BScroll(this.warpRef.nativeElement,{
      scrollbar:{
        scrollbar:true,
        interactive:true
      },
       mouseWheel: {
        speed: 20,
        invert: false,
        easeTime: 300
      }
    });

    this.bs.on('scrollEnd',({ y }) => this.onScrollEnd.emit(y))
  }

  ngOnInit(): void {
  }

  private refresh(){
    this.bs.refresh();
  }

  refreshScroll(){
    setTimeout(() => this.refresh(),this.refreshDelay)
  }






}
