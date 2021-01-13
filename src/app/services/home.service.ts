import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Banner, HotTag, SongSheet } from './data-types/common.type';
import { API_CONFIG, ServicesModule } from './services.module';
import { map } from 'rxjs/internal/operators';


@Injectable({
  providedIn: ServicesModule
})
export class HomeService {

  constructor(private httpClient: HttpClient , @Inject(API_CONFIG) private url: string ) { }

  /**
   * 获取轮播组件
   */
  getBanners(): Observable<Banner[]>{
    return this.httpClient.get(this.url + 'banner')
    .pipe(map((res: {banners: Banner[]}) => res.banners));

  }

  /**
   * 获取热门分类
   */
  getHotTags(): Observable<HotTag[]>{
    return this.httpClient.get(this.url + 'playlist/hot')
      .pipe(map((res: {tags: HotTag[]}) => {
        return res.tags.sort((x: HotTag, y: HotTag) => x.position - y.position).splice(0, 5);
      }));
  }

  /**
   * 获取歌单
   */
  getPersonalSheetList(): Observable<SongSheet[]>{
    return this.httpClient.get(this.url + 'personalized')
      .pipe(map((res: {result: SongSheet[]}) => res.result.splice(0, 16)));
  }

}
