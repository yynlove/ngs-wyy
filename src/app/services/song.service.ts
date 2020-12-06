import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG, ServicesModule } from './services.module';
import { map } from 'rxjs/internal/operators';
import {  Lyric, Song, SongUrl } from './data-types/common.type';



@Injectable({
  providedIn: ServicesModule
})
export class SongService {

  constructor(private httpClient:HttpClient, @Inject(API_CONFIG) private url:string ) { }

  //获取歌曲url
  getSongUrl(ids:string):Observable<SongUrl[]>{
    const params = new HttpParams().set("id",ids);
    return this.httpClient.get(this.url+'song/url',{params})
    .pipe(map((res:{data:SongUrl[]})=>res.data));
  }


  //获取歌曲url
  getSongDetail(ids:string):Observable<Song>{
    const params = new HttpParams().set("ids",ids);
    return this.httpClient.get(this.url+'song/detail',{params})
    .pipe(map((res:{songs:Song})=>res.songs[0]));
  }



  //获取歌单列表
  getSongList(songs:Song | Song[]):Observable<Song[]>{
    const songsArr = Array.isArray(songs)? songs.slice():[songs];
    const ids = songsArr.map(item=>item.id).join(',');
    return this.getSongUrl(ids).pipe(map(urls=>this.generateSongList(songsArr,urls)));
  }

  // 构建歌曲列表
  private generateSongList(songsArr:Song[],urls:SongUrl[]):Song[]{
    console.log("songsArr:",songsArr);
    const res = [];
    songsArr.forEach(song=>{
      const url =  urls.find(url=>url.id === song.id).url;

      if(url){
        res.push({...song,url});
      }
    })
    return res;
  }

  //获取歌词
  getLyric(songId:number): Observable<Lyric>{
    const params = new HttpParams().set('id',songId.toString());
    //map 组装需要的数据格式
    return this.httpClient.get(this.url+ 'lyric',{params})
    .pipe(map((res: { [key:string]:{ lyric:string; }}) => {
     try{
      return {
        lyric :res.lrc.lyric,
        tlyric:res.tlyric.lyric
      }
    }catch(err){
        return {
          lyric :'',
          tlyric:''
        }
      }
    }));
  }

}
