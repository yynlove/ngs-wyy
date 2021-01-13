import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeResolverService } from './home-roselver.service';
import { HomeComponent } from './home.component';

const routes: Routes = [
  /**
   * Resolve: 预先获取组件数据
   */
  {path: '', component: HomeComponent, data: {title: '发现'}, resolve: {homeDatas: HomeResolverService}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [HomeResolverService]
})
export class HomeRoutingModule { }
