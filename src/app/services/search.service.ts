import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG, ServicesModule } from './services.module';
import { map } from 'rxjs/internal/operators';
import {  Lyric, SearchResult, Song, SongUrl } from './data-types/common.type';



@Injectable({
  providedIn: ServicesModule
})
export class SearchService {

  constructor(private httpClient: HttpClient, @Inject(API_CONFIG) private url: string ) { }

  search(keywords: string): Observable<SearchResult>{
    const params = new HttpParams().set('keywords', keywords);
    return  this.httpClient.get(this.url + 'search/suggest', {params})
          .pipe(map((res: {result: SearchResult}) => res.result));
  }

}
