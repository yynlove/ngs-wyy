import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { SearchResult } from './services/data-types/common.type';
import { SearchService } from './services/search.service';
import { LoginParams } from './share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component';
import { AppStoreModule } from './store';
import { SetModalType } from './store/actions/member-action';
import { BatchActionsService } from './store/batch-actions.service';
import { ModalTypes } from './store/reducers/member.reducer';
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

  constructor(private searchService:SearchService,
    private store$:Store<AppStoreModule>,
    private batchActionService : BatchActionsService){}

  onSearch(value:string){
    if(value){
      this.searchService.search(value).subscribe(res =>{
        this.searchResult = this.highlightKetWords(value,res);
      })

    }else{
      this.searchResult = {};
    }
  }
  /**
   *
   * @param keywords 高亮搜索歌词
   * @param res
   */
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

  onChangeModalTypes(type = ModalTypes.Default){
    this.store$.dispatch(SetModalType({modalType:type}))
  }


  openModal(type: string){
    this.batchActionService.controlModal(true,<ModalTypes>type);
  }

  onLogin(params:LoginParams){
    console.log('params',params);

  }

}
