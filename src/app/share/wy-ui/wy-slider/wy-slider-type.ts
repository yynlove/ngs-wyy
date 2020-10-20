import { Observable } from 'rxjs'

export type WySliderStyle={
  width?:string | null;
  height?:string | null;
  left?:string | null;
  bottom?:string | null;


}


export type SliderEventObserverCOnfig ={
  start:string;
  move:string;
  end:string;
  filter:(e:Event)=>boolean;
  piuckKey:string[];

  startPluck$?:Observable<number>;
  moveResolved$?:Observable<number>;
  end$?:Observable<Event>;
}
