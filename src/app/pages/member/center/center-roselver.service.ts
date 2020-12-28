import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { forkJoin, Observable } from 'rxjs';
import { first } from 'rxjs/internal/operators';
import { RecordVal, User, UserSheet } from 'src/app/services/data-types/member.type';
import { MemberServices, RecordType } from 'src/app/services/member.service';


type CenterDataType =[User,RecordVal[],UserSheet]

@Injectable()
export class CenterResolverService implements Resolve<CenterDataType> {
  constructor(
    private memberServices:MemberServices,
    private router :Router) {}


  resolve(route :ActivatedRouteSnapshot):Observable<CenterDataType> {

    const uid = route.paramMap.get('id');
    if(uid){
      return forkJoin([
        this.memberServices.getUserDetail(uid),
        this.memberServices.getUserRecord(uid),
        this.memberServices.getUserSheets(uid)
      ]).pipe(first());
    }else{
      this.router.navigate(['/home'])
    }


  }
}
