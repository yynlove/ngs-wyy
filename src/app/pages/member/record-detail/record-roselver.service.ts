import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { first } from 'rxjs/internal/operators';
import { RecordVal, User } from 'src/app/services/data-types/member.type';
import { MemberServices } from 'src/app/services/member.service';


type RecordDataType = [User, RecordVal[]];

@Injectable()
export class RecordResolverService implements Resolve<RecordDataType> {
  constructor(
    private memberServices: MemberServices,
    private router: Router) {}


  resolve(route: ActivatedRouteSnapshot): Observable<RecordDataType> {

    const uid = route.paramMap.get('id');
    if (uid){
      return forkJoin([
        this.memberServices.getUserDetail(uid),
        this.memberServices.getUserRecord(uid)
      ]).pipe(first());
    }else{
      this.router.navigate(['/home']);
    }


  }
}
