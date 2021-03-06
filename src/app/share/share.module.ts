import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { WyUiModule } from './wy-ui/wy-ui.module';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    NzLayoutModule,
    NzMenuModule,
    NzInputModule,
    NzIconModule,
    NzRadioModule,
    NzNoAnimationModule,
    NzCarouselModule,
    NzModalModule,
    NzPaginationModule,
    NzTagModule,
    NzButtonModule,
    NzTableModule,
    NzMessageModule,
    NzAvatarModule,
    NzToolTipModule,
    NzDividerModule,
    NzListModule,
    NzSpinModule,
    NzBackTopModule,
    WyUiModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    NzLayoutModule,
    NzMenuModule,
    NzInputModule,
    NzIconModule,
    NzNoAnimationModule,
    NzCarouselModule,
    NzModalModule,
    NzPaginationModule,
    NzRadioModule,
    NzTagModule,
    NzButtonModule,
    NzTableModule,
    NzMessageModule,
    NzAvatarModule,
    NzToolTipModule,
    NzDividerModule,
    NzListModule,
    NzSpinModule,
    NzBackTopModule,
    WyUiModule,


  ],
  declarations: [],

})
export class ShareModule { }
