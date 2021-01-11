import { Component, OnInit, ChangeDetectionStrategy, forwardRef, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-wy-code',
  templateUrl: './wy-code.component.html',
  styleUrls: ['./wy-code.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[
    {
      //自定义表单注入Token
      provide:NG_VALUE_ACCESSOR,
      useExisting: forwardRef(()=> WyCodeComponent),
      multi:true
    }
  ]
})
/**
 * ControlValueAccessor 将表单自定义实现表单元素formControlName
 */
export class WyCodeComponent implements OnInit,ControlValueAccessor,AfterViewInit {

  @ViewChild('codeWrap',{static:true}) codeWrap:ElementRef;

  inputArr:[];
  //自定义表单元素所需
  private code : string;
  private onValueChange(value:string):void {}
  private onTouched():void {}
  
  constructor() { }

  /**
   * 自定义表单元素控件 实现的四个方法
   * writeValue
   * registerOnChange
   * registerOnTouched
   * setDisabledState
   * @param code 
   */
  //输入
  writeValue(code: string): void {
    this.setValue(code)
  }
  registerOnChange(fn: (value:string) => void): void {
    this.onValueChange = fn;
  }
  registerOnTouched(fn: ()=>void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }


  setValue(code: string) {
    this.code = code;
  }

}
