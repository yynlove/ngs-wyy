import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG, ServicesModule } from './services.module';
import { map } from 'rxjs/internal/operators';
import { Signin, User } from './data-types/member.type';
import { LoginParams } from '../share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component';

import queryString from 'query-string';
import { SampleBack } from './data-types/common.type';
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



  logout():Observable<SampleBack> {
    return this.httpClient.get(this.url + "logout").pipe(map(res => res as SampleBack));
  }



  signin():Observable<Signin>{
    const params = new HttpParams({ fromString:queryString.stringify({type : 1})});
    return this.httpClient.get(this.url + "daily_signin",{params}).pipe(map(res =>res as Signin));
  }


}
