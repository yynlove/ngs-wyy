import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/internal/operators';
import { SearchResult } from 'src/app/services/data-types/common.type';
import { isEmptyObject } from 'src/app/util/tools';
import { WySearchPanelComponent } from './wy-search-panel/wy-search-panel.component';

@Component({
  selector: 'app-wy-search',
  templateUrl: './wy-search.component.html',
  styleUrls: ['./wy-search.component.less']
})
export class WySearchComponent implements OnInit,AfterViewInit,OnChanges {

  @Input() searchResult :SearchResult;
  @Output() onSearch = new EventEmitter<string>();


  @Input() contextRef :ElementRef;

  @ViewChild('search',{static:false}) private defulatRef:ElementRef;


  @ViewChild('nzInput',{static:false}) private nzInput:ElementRef;


  overlayRef:OverlayRef;
  constructor(private overlay :Overlay,private viewContainerRef:ViewContainerRef) { }



  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    fromEvent(this.nzInput.nativeElement,'input')
    .pipe(debounceTime(300),distinctUntilChanged(),pluck('target','value'))
    .subscribe((value:string) =>{
      this.onSearch.emit(value);
    })
  }


  ngOnChanges(changes: SimpleChanges): void {
    if(changes['searchResult'] && !changes['searchResult'].firstChange){

      if(!isEmptyObject(this.searchResult)){
        this.showOverlayPanel();
      }
    }
  }

  onFocus(){
    if(this.searchResult && !isEmptyObject(this.searchResult)){
      this.showOverlayPanel();
    }
  }

  //显示浮层组件
  showOverlayPanel() {
    this.hideOverlayPanel();
    //创建浮层的位置策略
   const positionStrategy = this.overlay.position().flexibleConnectedTo(this.contextRef || this.defulatRef)
   .withPositions([{
      originX:'start',
      originY:'bottom',
      overlayX:'start',
      overlayY:'top'
    }]).withLockedPosition(true);
    //创建一个浮层
    this.overlayRef =this.overlay.create({
      //设置一层蒙层
      hasBackdrop:true,
      positionStrategy,
      //滚动策略
      scrollStrategy:this.overlay.scrollStrategies.reposition()
    });
    //创建一个门户
    const panelProtal = new ComponentPortal(WySearchPanelComponent,this.viewContainerRef)
    //浮层关联门户
    const panelRef =  this.overlayRef.attach(panelProtal);
    //点击蒙层 则关闭浮层
    this.overlayRef.backdropClick().subscribe(() =>{
      this.hideOverlayPanel()
    })
  }
  //隐藏浮层组件
  hideOverlayPanel() {
    if(this.overlayRef && this.overlayRef.hasAttached){
      this.overlayRef.dispose()

    }
  }

}
