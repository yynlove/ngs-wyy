import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { first } from 'rxjs/internal/operators';
import { Lyric, Song } from 'src/app/services/data-types/common.type';
import { SongService } from 'src/app/services/song.service';

type SongDataModel = [Song, Lyric];

@Injectable()
export class SongInfoResolverService implements Resolve<SongDataModel>{

  constructor(private songService: SongService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<SongDataModel> {
    const id =  route.paramMap.get('id');

    return forkJoin([this.songService.getSongDetail(id), this.songService.getLyric(Number(id))]).pipe(first());
  }


}
