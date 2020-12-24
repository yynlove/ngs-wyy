import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG, ServicesModule } from './services.module';
import { map } from 'rxjs/internal/operators';
import { User } from './data-types/member.type';
import { LoginParams } from '../share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component';

import queryString from 'query-string';
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

}
