import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyLayerModelComponent } from './wy-layer-model/wy-layer-model.component';
import { WyLayerDefaultComponent } from './wy-layer-default/wy-layer-default.component';
import { NzButtonModule } from 'ng-zorro-antd/button';



@NgModule({
  declarations: [WyLayerModelComponent, WyLayerDefaultComponent],
  imports: [
    CommonModule,
    NzButtonModule
  ],
  exports:[
    WyLayerModelComponent,
    WyLayerDefaultComponent
  ]
})
export class WyLayerModule { }
