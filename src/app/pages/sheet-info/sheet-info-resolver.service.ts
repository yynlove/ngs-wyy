import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SongSheet } from 'src/app/services/data-types/common.type';
import { SheetService } from 'src/app/services/sheet.service';

@Injectable()
export class SheetInfoResolverService implements Resolve<SongSheet>{

  constructor(private sheetService: SheetService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<SongSheet> {

    return this.sheetService.getSongSheetDetail(Number(route.paramMap.get('id')));
  }


}
