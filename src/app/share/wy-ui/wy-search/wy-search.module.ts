import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WySearchComponent } from './wy-search.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { WySearchPanelComponent } from './wy-search-panel/wy-search-panel.component';
import {OverlayModule} from '@angular/cdk/overlay';


@NgModule({
  declarations: [WySearchComponent, WySearchPanelComponent],
  entryComponents: [WySearchComponent], // 动态组件
  imports: [
    CommonModule,
    NzIconModule,
    NzInputModule,
    OverlayModule
  ],
  exports: [WySearchComponent]
})
export class WySearchModule { }
