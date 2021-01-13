import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/internal/operators';
import { SheetList, Song, SongSheet } from './data-types/common.type';
import { API_CONFIG, ServicesModule } from './services.module';
import { SongService } from './song.service';
import queryString from 'query-string';

export type SheetParams = {
  offset: number,
  limit: number,
  order: 'new' | 'hot',
  cat: string
};

@Injectable({
  providedIn: ServicesModule
})
export class SheetService {

  constructor(private httpClient: HttpClient , private songService: SongService , @Inject(API_CONFIG) private url: string ) { }

  // 获取歌单详情
  getSongSheetDetail(id: number): Observable<SongSheet>{
    const params = new HttpParams().set('id', id.toString());
    return this.httpClient.get(this.url + 'playlist/detail', {params})
    .pipe(map((res: {playlist: SongSheet}) => res.playlist));

  }

  // 获取歌单列表
  getSheet(args: SheetParams): Observable<SheetList>{

    const params = new HttpParams({ fromString: queryString.stringify(args)});
    return this.httpClient.get(this.url + 'top/playlist', {params}).pipe(map(res => res as SheetList));

  }


  playSheet(id: number): Observable<Song[]>{
    return this.getSongSheetDetail(id)
    .pipe(pluck('tracks'), switchMap(tracks => this.songService.getSongList(tracks)));

  }

}
