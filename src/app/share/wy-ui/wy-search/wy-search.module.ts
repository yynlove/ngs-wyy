import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WySearchComponent } from './wy-search.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';



@NgModule({
  declarations: [WySearchComponent],
  imports: [
    CommonModule,
    NzIconModule,
    NzInputModule
  ],
  exports:[WySearchComponent]
})
export class WySearchModule { }
