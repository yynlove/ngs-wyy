import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG, ServicesModule } from './services.module';
import { map } from 'rxjs/internal/operators';
import queryString from 'query-string';
import { Singer, SingerDetail } from './data-types/common.type';

type SingerParams= {
  offset: number,
  limit: number,
  type: number,
  area: number
};

const defaultParams: SingerParams = { offset: 0, limit: 10, type: 2, area: 8};

@Injectable({
  providedIn: ServicesModule
})
export class SingerService {

  constructor(private httpClient: HttpClient , @Inject(API_CONFIG) private url: string ) { }

  /**
   * 获取轮播组件
   */
  getEnterSingers(args: SingerParams = defaultParams): Observable<Singer[]>{
    const params =  new HttpParams({ fromString: queryString.stringify(args) });
    return this.httpClient.get(this.url + 'artist/list', {params})
    .pipe(map((res: {artists: Singer[]} ) => res.artists));

  }

  /**
   * 获取歌手部分信息和热门歌曲
   */
  getSingerDetail(id: string): Observable<SingerDetail>{
    const params = new HttpParams().set('id', id);
    return this.httpClient.get(this.url + 'artists', {params})
    .pipe(map( res => res as SingerDetail ));
  }

/**
 * 获取相似歌手
 */
 getSimiSinger(id: string): Observable<Singer[]>{
    const params = new HttpParams().set('id', id);
    return this.httpClient.get(this.url + 'simi/artist', {params})
    .pipe(map((res: {artists: Singer[]}) => res.artists ));
  }
}
