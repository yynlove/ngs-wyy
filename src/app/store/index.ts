import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { playReducer } from './reducers/player.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { memberReducer } from './reducers/member.reducer';



@NgModule({
  declarations: [],
  imports: [
    //注册playReducer
    StoreModule.forRoot({player:playReducer,member:memberReducer},{
      //配置项
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true,
      },
    }),
    StoreDevtoolsModule.instrument({
      //记录20条
      maxAge:20,
      //生产模式下
      logOnly:environment.production

    })
  ]
})
export class AppStoreModule { }
