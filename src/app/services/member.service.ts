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


export type ShareParams={
  id:string;
  type:string;
  msg:string;
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

  //收藏歌曲
  likeSong({pid,tracks}:likeSongParams) : Observable<number>{

    const params = new HttpParams({ fromString:queryString.stringify({pid,tracks,op :'add'})});
    return this.httpClient.get(this.url+"playlist/tracks",{params}).pipe(map((res:SampleBack)=>res.code));
  }

  //创建歌单
  createSheet(name:string):Observable<string>{
    const params = new HttpParams({ fromString:queryString.stringify({ name })});
    return this.httpClient.get(this.url+"playlist/create",{params}).pipe(map((res:SampleBack)=> res.id.toString()));

  }


  //收藏歌单
  likeSheet(id:string,t=1):Observable<number>{
    const params = new HttpParams({ fromString:queryString.stringify({id,t})});
    return this.httpClient.get(this.url+"playlist/subscribe",{params}).pipe(map((res:SampleBack)=>res.code));
  }


  //分享资源
  shareResource(shareParams :ShareParams):Observable<number>{
    const params = new HttpParams({ fromString:queryString.stringify(shareParams)});
    return this.httpClient.get(this.url+"share/resource",{params}).pipe(map((res:SampleBack) =>res.code));
  }


  //收藏歌手
  likeSinger(id:number,t=1):Observable<number>{
    const params = new HttpParams({ fromString:queryString.stringify({id,t})});
    return this.httpClient.get(this.url+"artist/sub",{params}).pipe(map((res:SampleBack) =>res.code));
  }


  //发送验证码
  sendCode(phone:number):Observable<number>{
    const params = new HttpParams({ fromString:queryString.stringify({phone})});
    return this.httpClient.get(this.url+"captcha/sent",{params}).pipe(map((res:SampleBack) =>res.code));
  }

  //验证验证码
  checkCode(phone:number,captcha:number):Observable<number>{
    const params = new HttpParams({ fromString:queryString.stringify({phone,captcha})});
    return this.httpClient.get(this.url+"captcha/verify",{params}).pipe(map((res:SampleBack) =>res.code));
  }
  //检测手机是否已经注册
  checkExist(phone:number):Observable<number>{
    const params = new HttpParams({ fromString:queryString.stringify({phone})});
    return this.httpClient.get(this.url+"cellphone/existence/check",{params}).pipe(map((res:SampleBack) =>res.code));

  }


}
