import { range } from 'rxjs';

export function limitNumberInRange(val: number, min: number, max: number): number{
    return Math.min(Math.max(val, min), max);

}


export function getPercent(min: number, max: number, val: number){
    return (val - min) / (max - min) * 100;
}


// 取一个区间的随机数
export function getRomdomInt(range: [number, number]): number{
  return Math.floor(Math.random() * (range[1] - range[0] + 1));
}
