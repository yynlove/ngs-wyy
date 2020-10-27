import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  /**
   * 重定向路由需要pathMatch属性
   * pathMatch:'full' =>URL中剩下的。未匹配的部分必须等于''
   * 此外还有一个可能值为：'prefix'
   *
   */
  {path:'',redirectTo:'home',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
