import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { getModal, getModalType, getModalVisible } from 'src/app/store/selectors/Menber.selector';

@Component({
  selector: 'app-wy-layer-model',
  templateUrl: './wy-layer-model.component.html',
  styleUrls: ['./wy-layer-model.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerModelComponent implements OnInit {

  constructor(private store$:Store<AppStoreModule>)
  {
    const appStore$ = this.store$.pipe(select(getModal));
    appStore$.pipe(select(getModalVisible)).subscribe((visible)=>{
      console.log('visible',visible);
    })
    appStore$.pipe(select(getModalType)).subscribe((type)=>{
      console.log('type',type);

    })
  }

  ngOnInit(): void {
  }

}
