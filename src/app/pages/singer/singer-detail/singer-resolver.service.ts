import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { first } from 'rxjs/internal/operators';
import { Singer, SingerDetail,  } from 'src/app/services/data-types/common.type';
import { SingerService } from 'src/app/services/singer.service';


type SingerModal = [SingerDetail, Singer[]];


@Injectable()
export class SingerResolverService implements Resolve<SingerModal>{

  constructor(private singerService: SingerService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<SingerModal> {
    const id =  route.paramMap.get('id');
    return forkJoin([
      this.singerService.getSingerDetail(id),
      this.singerService.getSimiSinger(id)
    ]).pipe(first());
  }


}
