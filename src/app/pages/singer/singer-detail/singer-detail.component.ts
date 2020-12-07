import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { SingerDetail } from 'src/app/services/data-types/common.type';
import { SingerService } from 'src/app/services/singer.service';

@Component({
  selector: 'app-singer-detail',
  templateUrl: './singer-detail.component.html',
  styleUrls: ['./singer-detail.component.less']
})
export class SingerDetailComponent implements OnInit {

  singerDetail :SingerDetail;

  constructor(private route:ActivatedRoute) {
    this.route.data.pipe(map(res =>res.singerDetail)).subscribe(singerDetail =>{
      this.singerDetail = singerDetail;

    })
   }

  ngOnInit(): void {
  }

}
