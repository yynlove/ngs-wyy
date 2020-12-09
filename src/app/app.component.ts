import { Component } from '@angular/core';
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'ngs-wyy';

  menu = [
    {
      label:'发现',
      path:'/home'
    },{
      label:'歌单',
      path:'/sheet'
    }
  ]


  constructor(private searchService:SearchService){}

  onSearch(value:string){
    if(value){
      this.searchService.search(value).subscribe(res =>{
        console.log('res',res);
      })

    }
  }

}
