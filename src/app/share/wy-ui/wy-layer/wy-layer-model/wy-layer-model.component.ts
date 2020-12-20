import { Overlay, OverlayContainer, OverlayKeyboardDispatcher, OverlayRef, ScrollStrategy } from '@angular/cdk/overlay';
import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef, AfterViewInit, ViewChild, Renderer2, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';
import { getModal, getModalType, getModalVisible } from 'src/app/store/selectors/Menber.selector';
import {ESCAPE} from '@angular/cdk/keycodes';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from 'src/app/services/services.module';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-wy-layer-model',
  templateUrl: './wy-layer-model.component.html',
  styleUrls: ['./wy-layer-model.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:[
    trigger('showModal',[
      state('show',style({ transform:'scale(1)',opacity:1})),
      state('hide',style({ transform:'scale(0)',opacity:0})),
      transition('show <=> hide',animate('0.2s'))
    ])
  ]
})
export class WyLayerModelComponent implements OnInit,AfterViewInit,OnChanges{

  //控制组件是否显示
  showModal:'show'|'hide'='hide';

  currentModalType = ModalTypes.Default;
  private visible = false;

  //浮块
  private overleyRef:OverlayRef;
  //浮块展开时 滚动属性
  private scrollStrategy :ScrollStrategy
  //浮块容器
  private overlayContainerEl:HTMLElement

  @ViewChild('modalContainer',{static:false}) private modalRef :ElementRef;
  //监听游览器窗口变化
  private resizeHandler:()=>void;

  constructor(
    @Inject(DOCUMENT) private doc:Document,
    @Inject(WINDOW) private win:Window,
    private store$:Store<AppStoreModule>,
    private overlay:Overlay,
    private elementRef:ElementRef,
    private overlayKeyboardDispatcher:OverlayKeyboardDispatcher,
    private overlayContainer: OverlayContainer,
    //手动触发检查变更
    private cdr:ChangeDetectorRef,
    private batchActionsService:BatchActionsService,
    private rd :Renderer2
    ){
    const appStore$ = this.store$.pipe(select(getModal));
    appStore$.pipe(select(getModalVisible)).subscribe((visible)=>{
      this.watchModalVisible(visible);
    })
    appStore$.pipe(select(getModalType)).subscribe((type)=>{
      this.watchModalType(type);
    })
    this.scrollStrategy =this.overlay.scrollStrategies.block();

  }



  watchModalType(type: ModalTypes) {
   if(this.currentModalType !== type){
      this.currentModalType = type;
      this.cdr.markForCheck();
   }
  }
  //组件是否可见
  watchModalVisible(visib: boolean) {


    if(this.visible !== visib){
      this.visible = visib;
      this.handleVisiblechange(visib);
    }
  }


  handleVisiblechange(visible: boolean) {
    if(visible){
      //显示 禁止滚动
      this.showModal = 'show';
      this.scrollStrategy.enable();
      //键盘按下事件绑定dom
      this.overlayKeyboardDispatcher.add(this.overleyRef);
      this.listenResizeToCenter();
      //显示时 点击页面其他无效
      this.changePointEvents('auto');
    }else{
      //隐藏 解除滚动
      this.showModal = 'hide';
      this.scrollStrategy.disable();
      this.overlayKeyboardDispatcher.remove(this.overleyRef);
      this.resizeHandler();

      this.changePointEvents('none');
    }
    this.cdr.markForCheck();
  }

  /**
   * 改变浮块显示时 背后的点击事件
   */
  changePointEvents(type:'none' | 'auto') {
    if(this.overlayContainerEl){
      this.overlayContainerEl.style.pointerEvents =type;
    }

  }

  ngOnInit(): void {
    //创建一个浮块
    this.createOverlay();
  }


  ngAfterViewInit(): void {
    //获取该浮块容器
    this.overlayContainerEl = this.overlayContainer.getContainerElement();
    this.listenResizeToCenter();

  }

  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  listenResizeToCenter() {
   const modal = this.modalRef.nativeElement;
   const modalSize = this.getHightDomSize(modal);
   this.keepCenter(modal,modalSize);
   this.resizeHandler = this.rd.listen('window','resize',()=> this.keepCenter(modal,modalSize));
  }


  private keepCenter(modal: HTMLElement, modalSize: { w: number; h:number}) {
    // console.log('this.getWindowsize()',this.getWindowsize());
    // console.log('modalSize',modalSize);

    const left =(this.getWindowsize().w-modalSize.w) /2;
    const top = (this.getWindowsize().h -modalSize.h) /2;

    modal.style.left = left+'px';
    modal.style.top = top+'px';
  }
  private getWindowsize() {
    return{
      w: this.win.innerWidth || this.doc.documentElement.clientWidth || this.doc.body.offsetWidth,
      h: this.win.innerHeight || this.doc.documentElement.clientHeight || this.doc.body.offsetHeight
    }
  }
  private getHightDomSize(dom: HTMLElement) {
    return {
      w: dom.offsetWidth,
      h:dom.offsetHeight
    }
  }





  createOverlay() {
    //创建一个浮块
    this.overleyRef = this.overlay.create();
    //将该组件放到元素中
    this.overleyRef.overlayElement.appendChild(this.elementRef.nativeElement)
    //订阅键盘按下事件
    this.overleyRef.keydownEvents().subscribe(e =>this.keydownListener(e));

  }

  keydownListener(e: KeyboardEvent): void {

    if(e.keyCode === ESCAPE){
      this.hide()
    }
  }


  hide(){
    this.batchActionsService.controlModal(false);
  }

}