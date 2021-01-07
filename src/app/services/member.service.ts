import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG, ServicesModule } from './services.module';
import { map } from 'rxjs/internal/operators';
import { RecordVal, Signin, User, UserRecord, UserSheet } from './data-types/member.type';
import { LoginParams } from '../share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component';
import queryString from 'query-string';
import { SampleBack, SongSheet } from './data-types/common.type';


export enum RecordType {
  allData,
  weekData
}

export type likeSongParams = {
  pid:string,
  tracks:string
}

@Injectable({
  providedIn: ServicesModule
})
export class MemberServices {



  constructor(private httpClient:HttpClient , @Inject(API_CONFIG) private url:string ) { }


  /**
   * 获取热门分类
   */
  doLogin(formModel:LoginParams):Observable<User>{
    const params = new HttpParams({ fromString:queryString.stringify(formModel)});
    return this.httpClient.get(this.url +"login/cellphone",{params})
      .pipe(map(res => res as User));
  }


  getUserDetail(uid: string):Observable<User> {

    const params = new HttpParams().set('uid',uid);
    return this.httpClient.get(this.url +"user/detail",{params})
      .pipe(map(res => res as User));
  }


  //退出
  logout():Observable<SampleBack> {
    return this.httpClient.get(this.url + "logout").pipe(map(res => res as SampleBack));
  }


  //签到
  signin():Observable<Signin>{
    const params = new HttpParams({ fromString:queryString.stringify({type : 1})});
    return this.httpClient.get(this.url + "daily_signin",{params}).pipe(map(res =>res as Signin));
  }

  //听歌记录
  getUserRecord(uid:string,type=RecordType.weekData):Observable<RecordVal[]>{
    const params = new HttpParams({ fromString:queryString.stringify({uid,type})});
    return this.httpClient.get(this.url + "user/record",{params})
    .pipe(map((res:UserRecord) =>res[RecordType[type]]));

  }

  //用户歌单
  getUserSheets(uid:string):Observable<UserSheet>{
    const params = new HttpParams({ fromString:queryString.stringify({uid})});
    return this.httpClient.get(this.url +"user/playlist",{params})
    .pipe(map((res:{playlist:SongSheet[]} )=>{
      const list = res.playlist;
      return {
        self : list.filter(item => !item.subscribed),
        subscribed: list.filter(item => item.subscribed)
      }
    }));
  }


  likeSong({pid,tracks}:likeSongParams) : Observable<number>{
    const params = new HttpParams({ fromString:queryString.stringify({pid,tracks,op :'add'})});
    return this.httpClient.get(this.url+"playlist/tracks",{params}).pipe(map((res:SampleBack)=>res.code));
  }





}
