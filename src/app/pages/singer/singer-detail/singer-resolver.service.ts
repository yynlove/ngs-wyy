import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { Lyric, SingerDetail, Song } from 'src/app/services/data-types/common.type';
import { SingerService } from 'src/app/services/singer.service';


@Injectable()
export class SingerResolverService implements Resolve<SingerDetail>{

  constructor(private singerService:SingerService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<SingerDetail> {
    const id =  route.paramMap.get('id');
    return this.singerService.getSingerDetail(id);
  }


}
