import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';
import { PagesModule } from '../pages/pages.module';
import { ServicesModule } from '../services/services.module';
import { ShareModule } from '../share/share.module';
import { registerLocaleData } from '@angular/common';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import zh from '@angular/common/locales/zh';
import { AppStoreModule } from '../store';

registerLocaleData(zh);

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ServicesModule,
    PagesModule,
    AppStoreModule,
    ShareModule,
    AppRoutingModule,
  ],
  exports: [
    ShareModule,
    AppRoutingModule,
  ],
    /** 配置 ng-zorro-antd 国际化 **/
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
})
export class CoreModule {

  /**
   * @skipSelf 使用父组件的值
   * @Optional 防止为null 报错
   */
  constructor(@SkipSelf() @Optional() parentModule: CoreModule){
    if (parentModule){
      throw new  Error('CoreModule只能被AppModule引入');
    }


  }

}
