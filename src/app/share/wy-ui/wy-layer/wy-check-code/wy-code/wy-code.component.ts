import { BACKSPACE } from '@angular/cdk/keycodes';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ChangeDetectionStrategy, forwardRef, AfterViewInit, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';

const CODELEN = 4;

@Component({
  selector: 'app-wy-code',
  templateUrl: './wy-code.component.html',
  styleUrls: ['./wy-code.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      // 自定义表单注入Token
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WyCodeComponent),
      multi: true
    }
  ]
})
/**
 * ControlValueAccessor 将表单自定义实现表单元素formControlName
 */
export class WyCodeComponent implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy {

  @ViewChild('codeWrap', {static: true}) private codeWrap: ElementRef;
  // 验证码
  inputArr = [];

  result: string[] = [];
  currentFocusIndex = 0;

  inputsEl: HTMLElement[];

  private destory$ = new Subject();

  // 自定义表单元素所需
  private code: string;
  private onValueChange(value: string): void {}
  private onTouched(): void {}

  constructor(private cdr: ChangeDetectorRef) {
    this.inputArr = Array(CODELEN).fill('');
  }

  /**
   * 自定义表单元素控件 实现的四个方法
   * writeValue
   * registerOnChange
   * registerOnTouched
   * setDisabledState
   * @param code
   */
  // 输入
  writeValue(code: string): void {
    this.setValue(code);
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onValueChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }



  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

    this.inputsEl = this.codeWrap.nativeElement.getElementsByClassName('item') as HTMLElement[];
    console.log('this.inputsEl', this.inputsEl);
    this.inputsEl[0].focus();
    for (let i = 0; i < this.inputsEl.length; i++){
      const item = this.inputsEl[i];
      fromEvent(item, 'keyup').pipe(takeUntil(this.destory$)).subscribe((event: KeyboardEvent) => this.listenKeyUp(event));
      fromEvent(item, 'click').pipe(takeUntil(this.destory$)).subscribe(() => this.currentFocusIndex = i);
    }

  }

  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }

  listenKeyUp(event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const isBackSpace = event.keyCode === BACKSPACE;
    if (/\D/.test(value)){
      target.value = '';
      this.result[this.currentFocusIndex] = '';
    }else if (value){
       this.result[this.currentFocusIndex] = value;
       this.currentFocusIndex = (this.currentFocusIndex + 1) % CODELEN;
       this.inputsEl[this.currentFocusIndex].focus();
     }else if (isBackSpace){
       this.result[this.currentFocusIndex] = '';
       this.currentFocusIndex = Math.max(this.currentFocusIndex - 1, 0);
       this.inputsEl[this.currentFocusIndex].focus();
     }
    this.checkResult(this.result);
  }
  checkResult(result: string[]) {
    const codeStr = result.join('');
    this.setValue(codeStr);

  }


  setValue(code: string) {
    this.code = code;
    this.onValueChange(code);
    this.cdr.markForCheck();
  }

}
