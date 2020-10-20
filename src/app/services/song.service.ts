import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG, ServicesModule } from './services.module';
import { map } from 'rxjs/internal/operators';
import {  Song, SongUrl } from './data-types/common.type';



@Injectable({
  providedIn: ServicesModule
})
export class SongService {

  constructor(private httpClient:HttpClient, @Inject(API_CONFIG) private url:string ) { }


  getSongUrl(ids:string):Observable<SongUrl[]>{
    const params = new HttpParams().set("ids",ids);
    return this.httpClient.get(this.url+'song/url',{params})
    .pipe(map((res:{data:SongUrl[]})=>res.data));
  }


  getSongList(songs:Song | Song[]):Observable<Song[]>{
    const songsArr = Array.isArray(songs)? songs.slice():[songs];
    const ids = songsArr.map(item=>item.id).join(',');
    return Observable.create(observer=>{
      this.getSongUrl(ids).subscribe(urls=>{
        observer.next();
      });
    })
  
  
  }

  private generateSongList(songsArr:Song[],urls:SongUrl[]):Song[]{

    const res = [];
    songsArr.forEach(song=>{
      const url =  urls.find(url=>url.id === song.id).url;
      if(url){
        res.push({...song,url});
      }
    })
    return res;
    
  }

}
