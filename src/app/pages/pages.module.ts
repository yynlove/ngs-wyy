import { NgModule } from '@angular/core';
import { HomeModule } from './home/home.module';
import { SheetInfoRoutingModule } from './sheet-info/sheet-info-routing.module';
import { SheetInfoModule } from './sheet-info/sheet-info.module';
import { SheetListModule } from './sheet-list/sheet-list.module';
import { SingerModule } from './singer/singer.module';
import { SongInfoModule } from './song-info/song-info.module';



@NgModule({
  declarations: [],
  imports: [
    HomeModule,
    SheetListModule,
    SheetInfoModule,
    SheetInfoRoutingModule,
    SongInfoModule,
    SingerModule
  ],
  exports:[
    HomeModule,
    SheetListModule,
    SheetInfoModule,
    SheetInfoRoutingModule,
    SingerModule
  ]
})
export class PagesModule { }
