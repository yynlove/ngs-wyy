import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Inject, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, merge,Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, takeUntil, tap } from 'rxjs/internal/operators';
import { getElementOffset, isArray } from 'src/app/util/array';
import { getPercent, limitNumberInRange } from 'src/app/util/number';
import { sliderEvent } from './wy-slider-helper';
import { SliderEventObserverConfig, SliderValue } from './wy-slider-type';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation:ViewEncapsulation.None,
  changeDetection:ChangeDetectionStrategy.OnPush,
  providers:[{
    //自定义表单注入Token
    provide:NG_VALUE_ACCESSOR,
    useExisting: forwardRef(()=>WySliderComponent),
    multi:true
  }]
  })
export class WySliderComponent implements OnInit,OnDestroy,ControlValueAccessor {


  private sliderDom :HTMLDivElement;
  //滑块横 竖 false=横向
  @Input() wyVertical = false;

  @Input() wyMin =0;

  @Input() bufferOffset:number;

  @Input() wyMax =100;

  @Output() wyOnAfterChange = new EventEmitter<SliderValue>();

  /**
   * ElementRef 对视图中某个原生元素的包装器。
   * ViewChild 属性装饰器，用于配置一个视图查询。 变更检测器会在视图的 DOM 中查找能匹配上该选择器的第一个元素或指令。
   *            如果视图的 DOM 发生了变化，出现了匹配该选择器的新的子节点，该属性就会被更新。
   */
  @ViewChild('wySlider' , { static: true})
  private wySlider : ElementRef;

  //滑块是否滑动 true 是否滑动
  private isDragging:boolean;

  value : SliderValue=null;
  offset :SliderValue=null;
  //发布者
  private dragStarts$ :Observable<number>;
  private dragMove$ :Observable<number>;
  private dragEnd$ :Observable<Event>;

  //订阅
  private dragStarts_ :Subscription | null;
  private dragMove_ :Subscription | null;
  private dragEnd_ :Subscription | null;

  /**
   *
   * @param doc  @Inject() 指定自定义提供者自定义提供者让你可以为隐式依赖提供一个具体的实现
   * @param cdr  提供变更检测功能
   */
  constructor(@Inject(DOCUMENT) private doc :Document,private cdr:ChangeDetectorRef) { }




  ngOnInit() {
    //nativeElement  原生元素 这里指的是这个控件本身。
    this.sliderDom = this.wySlider.nativeElement;
    console.log('el:',this.wySlider.nativeElement);
    this.createDragginObervables();
    //订阅开始事件
    this.subcribeDrag(['start']);
  }

  private createDragginObervables(){
    //纵向或横向滑条
    const orientField = this.wyVertical?'pageY':'pageX';

    const mouse :SliderEventObserverConfig ={
      start:'mousedown',
      move:'mousemove',
      end:'mouseup',
      //判断所属类型
      filter:(e:MouseEvent)=>e instanceof MouseEvent,
      piuckKey:[orientField]
    };
    //移动端触摸
    const touch :SliderEventObserverConfig={
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
        tap(sliderEvent),//拦截源上的每个发射并运行一个函数，但是只要不发生错误，就返回与源相同的输出。
        pluck(...piuckKey),
        map((position:number) =>this.findCloseValue(position)),
      );

      source.end$ = fromEvent(this.doc,end);

      source.moveResolved$ = fromEvent(this.doc,move).pipe(
        filter(filterFunc),
        tap(sliderEvent),
        pluck(...piuckKey),
        //未提供比较器功能，则默认情况下使用相等检查。
        distinctUntilChanged(),
        map((position:number) =>this.findCloseValue(position)),
        //让值传递，直到第二个 Observablenotifier发出值为止 。然后，它完成。
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
    const  ratio = limitNumberInRange((position - sliderStart)/sliderLength,0,1)
    const  retioTrue = this.wyVertical ? 1-ratio :ratio;
    return retioTrue * (this.wyMax - this.wyMin) + this.wyMin;

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
      // 手动变更检测
      // 当输入已更改或视图中发生了事件时，组件通常会标记为脏的（需要重新渲染）。
      // 调用此方法会确保即使那些触发器没有被触发，也仍然检查该组件。
      this.cdr.markForCheck();
    }
  }


  private onDragEnd(){
    //移动滑块鼠标抬起，发射一个事件
    this.wyOnAfterChange.emit(this.value);

    this.toggleDragMoving(false);
    this.cdr.markForCheck();
  }



  /**
   * 绑定和解绑  鼠标移动和抬起事件
   * @param movable 是否滑动
   */
  toggleDragMoving(movable:boolean) {
    this.isDragging = movable;
    if(movable){
      this.subcribeDrag(['move','end']);
    }else{
      this.unsubcribeDrag(['move','end']);
    }

  }


  /**
   *
   * @param value
   * @param needCheck传进来的值是否需要检测
   */
  setValue(value: number,needCheck:boolean =false) {
    if(needCheck){
      //拖拽不检测
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


  /**
   * ControlValueAccessor
   * 实现自定义表单ngModel功能
   *
   */
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
