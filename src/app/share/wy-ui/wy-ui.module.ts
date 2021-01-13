import { NgModule } from '@angular/core';
import { ImgDefualtDirective } from '../directives/img-defualt.directive';
import { PlayCountPipe } from '../pipes/play-count.pipe';
import { SingleSheetComponent } from './single-sheet/single-sheet.component';
import { WyLayerModule } from './wy-layer/wy-layer.module';
import { WyPlayerModule } from './wy-player/wy-player.module';
import { WySearchModule } from './wy-search/wy-search.module';



@NgModule({
  declarations: [
    SingleSheetComponent,
    PlayCountPipe,
    ImgDefualtDirective
  ],
  imports: [
    WyPlayerModule,
    WySearchModule,
    WyLayerModule,
  ],
  exports: [
    SingleSheetComponent,
    PlayCountPipe,
    WyPlayerModule,
    WySearchModule,
    WyLayerModule,
    ImgDefualtDirective
  ]
})
export class WyUiModule { }
