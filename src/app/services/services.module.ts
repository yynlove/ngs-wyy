import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const API_CONFIG = new InjectionToken('ApiConfigToken');

@NgModule({
  declarations: [],
  imports: [
    // BrowserModule,
    // AppRoutingModule,
    // HttpClientModule,
    // BrowserAnimationsModule
  ],
  providers:[
    {provide:API_CONFIG,useValue:'http://localhost:3000/'}
  ]
})
export class ServicesModule { }
