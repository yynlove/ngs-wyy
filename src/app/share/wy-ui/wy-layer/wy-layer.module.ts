import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyLayerModelComponent } from './wy-layer-model/wy-layer-model.component';
import { WyLayerDefaultComponent } from './wy-layer-default/wy-layer-default.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [WyLayerModelComponent, WyLayerDefaultComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    DragDropModule
  ],
  exports:[
    WyLayerModelComponent,
    WyLayerDefaultComponent
  ]
})
export class WyLayerModule { }
