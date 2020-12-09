import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/internal/operators';

@Component({
  selector: 'app-wy-search',
  templateUrl: './wy-search.component.html',
  styleUrls: ['./wy-search.component.less']
})
export class WySearchComponent implements OnInit,AfterViewInit {


  @Output() onSearch = new EventEmitter<string>();

  @ViewChild('nzInput',{static:false}) private nzInput:ElementRef;

  constructor() { }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    fromEvent(this.nzInput.nativeElement,'input')
    .pipe(debounceTime(300),distinctUntilChanged(),pluck('target','value'))
    .subscribe((value:string) =>{
      this.onSearch.emit(value);
    })
  }


}
