import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SheetList } from 'src/app/services/data-types/common.type';
import { SheetParams, SheetService } from 'src/app/services/sheet.service';
import { BatchActionsService } from 'src/app/store/batch-actions.service';




@Component({
  selector: 'app-sheet-list',
  templateUrl: './sheet-list.component.html',
  styleUrls: ['./sheet-list.component.less']
})
export class SheetListComponent implements OnInit {
  // 获取歌单参数
  listParams: SheetParams = {
    offset: 1,
    limit: 35,
    cat: '全部',
    order: 'hot'
  };

  // 歌单列表
  sheets: SheetList;
  // 默认选择
  orderValue = 'hot';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sheetService: SheetService,
    private batchActionService: BatchActionsService ) {
    this.listParams.cat = this.activatedRoute.snapshot.queryParamMap.get('cat') || '全部';
    this.getSheets();
   }
  getSheets() {
    this.sheetService.getSheet(this.listParams).subscribe(res => {
      console.log('res', res);
      this.sheets = res;
    });
  }


  onOrderValueChange(order: 'hot' | 'new' ){
    this.listParams.order = order;
    this.listParams.offset = 1;
    this.getSheets();
  }

  onPlaySheet(id: number){
    this.sheetService.playSheet(id).subscribe(list => {
        this.batchActionService.selectPlayList({list, index: 0});
      });
  }

  onPageChange(page: number){
    this.listParams.offset = page;
    this.getSheets();
  }


  toInfo(id: number){
    this.router.navigate(['/sheetinfo', id]);
  }

  ngOnInit(): void {
  }

}
