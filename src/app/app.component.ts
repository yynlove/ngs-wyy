import { Component } from '@angular/core';
import { SearchResult } from './services/data-types/common.type';
import { SearchService } from './services/search.service';
import { isEmptyObject } from './util/tools';

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


  searchResult :SearchResult;

  constructor(private searchService:SearchService){}

  onSearch(value:string){
    if(value){
      this.searchService.search(value).subscribe(res =>{
        this.searchResult = this.highlightKetWords(value,res);
      })

    }else{
      this.searchResult = {};
    }
  }
  highlightKetWords(keywords: string, res: SearchResult): SearchResult {
    if(!isEmptyObject(res)){
      const reg = new RegExp(keywords,'ig');
      ['songs','artists','playlists'].forEach(type =>{
        if(res[type]){
          res[type].forEach(item => {
            item.name = item.name.replace(reg,'<span class="highlight">$&</span>')
          });
        }
      });
      return res;
    }


  }

}
