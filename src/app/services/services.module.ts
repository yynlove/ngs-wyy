import { isPlatformBrowser } from '@angular/common';
import { InjectionToken, NgModule, PLATFORM_ID } from '@angular/core';
import { httpInterceptorProviders } from './http-interceptors';


export const API_CONFIG = new InjectionToken('ApiConfigToken');
export const WINDOW = new InjectionToken('WindowToken');
@NgModule({
  declarations: [],
  imports: [
    // BrowserModule,
    // AppRoutingModule,
    // HttpClientModule,
    // BrowserAnimationsModule
  ],
  providers:[
    {provide:API_CONFIG,useValue:'http://localhost:3000/'},
    {
      provide:WINDOW,
      useFactory(platformId:Object) : Window | Object {
        return isPlatformBrowser(platformId) ? window :{};
      },
      deps:[PLATFORM_ID] //平台

    },
    httpInterceptorProviders
  ]
})
export class ServicesModule { }
