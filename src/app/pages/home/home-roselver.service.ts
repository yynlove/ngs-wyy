import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { first } from 'rxjs/internal/operators';
import { Banner, HotTag, Singer, SongSheet } from 'src/app/services/data-types/common.type';
import { HomeService } from 'src/app/services/home.service';
import { SingerService } from 'src/app/services/singer.service';


type HomeDataType =[Banner[],HotTag[],SongSheet[],Singer[]]

@Injectable()
export class HomeResolverService implements Resolve<HomeDataType> {
  constructor(private homeServie:HomeService,private singerService:SingerService) {}

  resolve():Observable<HomeDataType> {

    return forkJoin([
      this.homeServie.getBanners(),
      this.homeServie.getHotTags(),
      this.homeServie.getPersonalSheetList(),
      this.singerService.getEnterSingers()
    ]).pipe(first());
  }
}
