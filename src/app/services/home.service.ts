import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Banner } from './data-types/common.type';
import { API_CONFIG, ServicesModule } from './services.module';
import { map } from 'rxjs/internal/operators';


@Injectable({
  providedIn: ServicesModule
})
export class HomeService {

  constructor(private httpClient:HttpClient , @Inject(API_CONFIG) private url:string ) { }

  getBanners(): Observable<Banner[]>{

    return this.httpClient.get(this.url + 'banner')
    .pipe(map((res:{banners:Banner[]})=>res.banners))

  }
}
