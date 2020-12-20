import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyLayerModelComponent } from './wy-layer-model/wy-layer-model.component';
import { WyLayerDefaultComponent } from './wy-layer-default/wy-layer-default.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WyLayerLoginComponent } from './wy-layer-login/wy-layer-login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@NgModule({
  declarations: [WyLayerModelComponent, WyLayerDefaultComponent, WyLayerLoginComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    DragDropModule,
    ReactiveFormsModule,
    NzInputModule,
    NzCheckboxModule,
    NzSpinModule,
    NzAlertModule,
    NzListModule,
    NzIconModule,
    NzFormModule,
    FormsModule
  ],
  exports:[
    WyLayerModelComponent,
    WyLayerDefaultComponent,
    WyLayerLoginComponent
  ]
})
export class WyLayerModule { }
