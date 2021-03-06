import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/internal/operators';
import { SearchResult, SongSheet } from './services/data-types/common.type';
import { User } from './services/data-types/member.type';
import { likeSongParams, MemberServices, ShareParams } from './services/member.service';
import { SearchService } from './services/search.service';
import { StorageService } from './services/storage.service';
import { LoginParams } from './share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component';
import { AppStoreModule } from './store';
import { SetModaalVisible, SetModalType, SetUserId } from './store/actions/member-action';
import { BatchActionsService } from './store/batch-actions.service';
import { ModalTypes, ShareInfo } from './store/reducers/member.reducer';
import { getLikeId, getModal, getModalType, getModalVisible, getShareInfo } from './store/selectors/Menber.selector';
import { codeJson } from './util/base64';
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
      label: '发现',
      path: '/home'
    }, {
      label: '歌单',
      path: '/sheet'
    }
  ];

  showSpin: boolean;

  // home 页面搜索结果
  searchResult: SearchResult;
  // 当前用户
  user: User;
  // 是否记住登录
  wyRememberLogin: LoginParams;
  // 自己的歌单
  mySheets: SongSheet[];
  // 要收藏的歌曲Id
  likeId: string;

  // 当前模块
  currentModalType: ModalTypes;
  // 是否可见
  visible: boolean;
  // 分享资源
  shareInfo: ShareInfo;

  // 路由结束
  navEnd: Observable<Event>;
  routeTitle = '';
  constructor(private searchService: SearchService,
              private store$: Store<AppStoreModule>,
              private batchActionService: BatchActionsService,
              private memberServices: MemberServices,
              private nzMessageService: NzMessageService,
              private storageService: StorageService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private titleService: Title
    ){
      const userId = this.storageService.getStorage('wyUserId');
      if (userId){
        this.store$.dispatch(SetUserId({userId}));
        this.memberServices.getUserDetail(userId).subscribe(user => {this.user = user; });
      }
      const wyRememberLogin =  this.storageService.getStorage('wyRememberLogin');
      if (wyRememberLogin){
        this.wyRememberLogin = JSON.parse(wyRememberLogin);
      }
      this.listenState();

      // 改变标题
      this.navEnd =  this.router.events.pipe(filter(evt => evt instanceof NavigationEnd));
      // 设置标题
      this.setTitle();

    }


  setTitle() {
    this.navEnd.pipe(
      map(() => this.activatedRoute),
      map((route: ActivatedRoute) => {
        while (route.firstChild){
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap(route => route.data)
    ).subscribe(data => {
      console.log('data', data);
      this.routeTitle = data.title;
      this.titleService.setTitle(this.routeTitle);
    });
  }


  listenState() {
    const memberState$ = this.store$.pipe(select(getModal));
    memberState$.pipe(select(getLikeId)).subscribe(res => this.watchLikeId(res));
    memberState$.pipe(select(getModalVisible)).subscribe((visible) => this.watchModalVisible(visible));
    memberState$.pipe(select(getModalType)).subscribe((type) => this.watchModalType(type));
    memberState$.pipe(select(getShareInfo)).subscribe((info) => this.watchShareInfo(info));
  }


  watchModalType(type: ModalTypes) {
    if (this.currentModalType !== type){
      if (type === ModalTypes.Like){
        this.onLoadMySheets();
      }
      this.currentModalType = type;

    }
   }
   // 组件是否可见
   watchModalVisible(visib: boolean) {
     if (this.visible !== visib){
       this.visible = visib;
     }
   }

  // 收藏id
  watchLikeId(likeId: string): void {
    if (likeId){
      this.likeId = likeId;
    }
  }

  // 查看分享资源
  watchShareInfo(info: ShareInfo): void{
    // 必须要判断
    if (info){
      if (this.user){
        this.shareInfo = info;
        this.openModal(ModalTypes.Share);
      }else{
        this.openModal(ModalTypes.Default);
      }
    }
  }




  onSearch(value: string){
    if (value){
      this.searchService.search(value).subscribe(res => {
        this.searchResult = this.highlightKetWords(value, res);
      });

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
    if (!isEmptyObject(res)){
      const reg = new RegExp(keywords, 'ig');
      ['songs', 'artists', 'playlists'].forEach(type => {
        if (res[type]){
          res[type].forEach(item => {
            item.name = item.name.replace(reg, '<span class="highlight">$&</span>');
          });
        }
      });
      return res;
    }
  }

  onChangeModalTypes(type = ModalTypes.Default){
    this.store$.dispatch(SetModalType({modalType: type}));
  }


  openModal(type: string){
    this.batchActionService.controlModal(true, type as ModalTypes);
  }

  onLogin(params: LoginParams){
    this.showSpin = true;
    this.memberServices.doLogin(params).subscribe(user => {
      console.log('user', user);
      this.user = user;
      this.closeModal();
      this.alertMessage('success', '登录成功');
      this.storageService.setStorage({key: 'wyUserId', value: user.profile.userId.toString()});
      this.store$.dispatch(SetUserId({userId: user.profile.userId.toString()}));
      if (params.remember){
        this.storageService.setStorage({key: 'wyRememberLogin', value: JSON.stringify(codeJson(params))});
      }else{
        this.storageService.removeStorage('wyRememberLogin');
      }
      this.showSpin = false;
    }, error => {
      console.log('error', error);

      this.showSpin = false;
      this.alertMessage('error', error.message);
    });
  }


  logout(){
    this.memberServices.logout().subscribe(sampleBack => {
      this.user = null;
      this.storageService.removeStorage('wyUserId');
      this.alertMessage('success', '已退出');
      this.store$.dispatch(SetUserId({userId: ''}));
    }, error => {
      this.alertMessage('error', error.message || '退出失败');
    });
  }

  alertMessage(type: string, msg: string) {
    this.nzMessageService.create(type, msg);
  }


  /**
   * 点击收藏 加载歌单，并打开弹窗
   */
  onLoadMySheets(){
    if (this.user){
      this.memberServices.getUserSheets(this.user.profile.userId.toString()).subscribe(userSheet => {
        this.mySheets = userSheet.self;
        this.store$.dispatch(SetModaalVisible({modalVisible: true}));
      });
    } else{
      this.openModal(ModalTypes.Default);
    }

  }


  /**
   * 收藏歌曲
   * @param args  歌单id 和歌曲id
   */
  onLikeSong(args: likeSongParams){
    this.memberServices.likeSong(args).subscribe(res => {
      this.closeModal();
      this.alertMessage('success', '收藏成功');
    }, error => {
      this.alertMessage('error', error.msg || '收藏失败');
    });
  }


  /**
   * 创建一个歌单 并收藏歌曲
   * @param name 歌单名字
   */
  onCreateSheet(name: string){
    this.memberServices.createSheet(name).subscribe(pid => {
      this.onLikeSong({pid, tracks: this.likeId});
    }, error => {
      this.alertMessage('error', '新建失败');
    });
  }

  /**
   * 分享页面关闭弹窗
   */
  closeModal() {
    this.batchActionService.controlModal(false);
  }


  /**
   * 分享
   * @param shareParams 参数
   */
  onShare(shareParams: ShareParams){
    console.log(shareParams);
    this.memberServices.shareResource(shareParams).subscribe(res => {
      this.closeModal();
      this.alertMessage('success', '分享成功');
    }, error => {
      this.alertMessage('error', '分享失败');
    });
  }


  onRegister(phone: number){
    this.alertMessage('success', phone + '注册成功');
  }

}
