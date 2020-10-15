import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeService } from 'src/app/services/home.service';
import { HomeResolverService } from './home-roselver.service';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {path:'home',component:HomeComponent,data:{title:'发现'},resolve:{homeDatas:HomeResolverService}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[HomeResolverService]
})
export class HomeRoutingModule { }
