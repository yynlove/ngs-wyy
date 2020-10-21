import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, Inject, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, merge,Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, takeUntil, tap } from 'rxjs/internal/operators';
import { getElementOffset, isArray } from 'src/app/util/array';
import { getPercent, limitNumberInRange } from 'src/app/util/number';
import { sliderEvent } from './wy-slider-helper';
import { SliderEventObserverCOnfig, SliderValue } from './wy-slider-type';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation:ViewEncapsulation.None,
  changeDetection:ChangeDetectionStrategy.OnPush,
  providers:[{
    provide:NG_VALUE_ACCESSOR,
    useExisting: forwardRef(()=>WySliderComponent),
    multi:true
  }]
  })
export class WySliderComponent implements OnInit,OnDestroy,ControlValueAccessor {


  private sliderDom :HTMLDivElement;
  //滑块横 竖
  @Input() wyVertical = false;
  @Input() wyMin =0;
  @Input() wyMax =100;

  @ViewChild('wySlider' , { static: true}) private wySlider : ElementRef;

  //滑块是否滑动
  private isDragging:boolean;

  value : SliderValue=null;
  offset :SliderValue=null;
  private dragStarts$ :Observable<number>;
  private dragMove$ :Observable<number>;
  private dragEnd$ :Observable<Event>;

  private dragStarts_ :Subscription | null;
  private dragMove_ :Subscription | null;
  private dragEnd_ :Subscription | null;

  constructor(@Inject(DOCUMENT) private doc :Document,private cdr:ChangeDetectorRef) { }




  ngOnInit() {
    this.sliderDom = this.wySlider.nativeElement;
    console.log('el:',this.wySlider.nativeElement);
    this.createDragginObervables();
    this.subcribeDrag(['start']);
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
        takeUntil(source.end$)
      );
    });
      //合并
      this.dragStarts$ = merge(mouse.startPluck$,touch.startPluck$);
      this.dragMove$ = merge(mouse.moveResolved$,touch.moveResolved$);
      this.dragEnd$ = merge(mouse.end$,touch.end$);
  }


  /**
   * 转换百分之 值
   * @param position 鼠标位置值
   */
  findCloseValue(position: number): number {
    //获取滑块总长度
    const sliderLength = this.getSliderLength();
    //滑块（左, 上）端点位置
    const sliderStart = this.getSliderStartPosition();
    //滑块当前位置 / 总长
    const  ratio = limitNumberInRange((position-sliderStart) / sliderLength,0,1) 
    const retioTrue = this.wyVertical? 1-ratio :ratio;
    return retioTrue * (this.wyMax-this.wyMin) + this.wyMin;
  
  }

  /**
   * 滑块（左, 上）端点位置
   */
  getSliderStartPosition():number {
    const offset = getElementOffset(this.sliderDom);
    return this.wyVertical?offset.top:offset.left;
  }

  /**
   * 获取滑块总长度
   */
  getSliderLength():number {
    return this.wyVertical?this.sliderDom.clientHeight:this.sliderDom.clientWidth;
  }

  

  /**
   * 订阅 事件
   * @param events 
   */
  private subcribeDrag(events:string[] = ['start','move','end']){
    if(isArray(events,'start')  && this.dragStarts$ && !this.dragStarts_){
      this.dragStarts_ = this.dragStarts$.subscribe(this.onDragStart.bind(this))
    }
    if(isArray(events,'move') && this.dragMove$ && !this.dragMove_){
      this.dragMove_ =  this.dragMove$.subscribe(this.onDragMove.bind(this))
    }
    if(isArray(events,'end') && this.dragEnd$ && !this.dragEnd_){
      this.dragEnd_ = this.dragEnd$.subscribe(this.onDragEnd.bind(this))
    }
  }

  /**
   * 取消订阅
   * @param events 
   */
  private unsubcribeDrag(events:string[] = ['start','move','end']){
    if(isArray(events,'start')  && this.dragStarts_){
      this.dragStarts_.unsubscribe();
      this.dragStarts_ = null;
    }
    if(isArray(events,'move') && this.dragMove_){
      this.dragMove_.unsubscribe();
      this.dragMove_ = null;
    }
    if(isArray(events,'end') && this.dragEnd_){
      this.dragEnd_.unsubscribe();
      this.dragEnd_ = null;
    }
  }
  

  private onDragStart(value:number){
    console.log("onDragStart:",value);
    //用于绑定和解绑事件
    this.toggleDragMoving(true);
    this.setValue(value,false);
  }
  
  private onDragMove(value:number){
    if(this.isDragging){
      this.setValue(value,false);
      //手动变更检测
      this.cdr.markForCheck();
    }
  }
  

  private onDragEnd(){
    this.toggleDragMoving(false);
    this.cdr.markForCheck();
  }



  toggleDragMoving(movable:boolean) {
    this.isDragging = movable;
    if(movable){ 
      this.subcribeDrag(['move','end']);
    }else{
      this.unsubcribeDrag(['move','end']);
    }
    
  }
  

  setValue(value: number,needCheck:boolean) {
    if(needCheck){
      if(this.isDragging) return;
      this.value = this.formatValue(value);
      this.updateTrackAndHandles();
    }else if(!this.valueEquals(this.value,value)){
      this.value = value;
      this.updateTrackAndHandles();
      this.onValueChange(this.value);
    }
  }

  formatValue(value: SliderValue): SliderValue {
    let res = value;
    if(this.asserValueValid(value)){
      res = this.wyMin;
    }else{
      res = limitNumberInRange(value,this.wyMin,this.wyMax);
    } 
    return res;
  }
  //判断是不是NAN
  asserValueValid(value: number) {
    return isNaN(typeof value!== 'number' ?parseFloat(value):value);
  }
  valueEquals(value1: number, value2: number) {
    if(typeof value1 !== typeof value2){
      return false;
    }
    return value1 === value2;
  }

  updateTrackAndHandles() {
    this.offset = this.getValueToOffset(this.value);
    this.cdr.markForCheck();
  }

  getValueToOffset(value: SliderValue): SliderValue {
    return getPercent(this.wyMin,this.wyMax,this.value);
  }



  private onValueChange(value:SliderValue):void{

  }

  private onTouched():void{

  }

    //实现自定义表单ngModel功能
    writeValue(value: SliderValue): void {
      this.setValue(value,true);
    }
    registerOnChange(fn: (value:SliderValue) => void): void {
      this.onValueChange = fn;
    }
    registerOnTouched(fn: ()=>void): void {
      this.onTouched = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
      throw new Error('Method not implemented.');
    }
    
    //组件销毁时解绑
    ngOnDestroy(): void {
      this.unsubcribeDrag();
    }
  



}
