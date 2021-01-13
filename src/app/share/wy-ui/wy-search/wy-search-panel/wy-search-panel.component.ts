import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchResult } from 'src/app/services/data-types/common.type';

@Component({
  selector: 'app-wy-search-panel',
  templateUrl: './wy-search-panel.component.html',
  styleUrls: ['./wy-search-panel.component.less']
})
export class WySearchPanelComponent implements OnInit {

  searchResult: SearchResult;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  // 点击跳转
  toInfo(path: [string, number]){
    this.router.navigate(path);
  }

}
