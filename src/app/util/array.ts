import { analyzeAndValidateNgModules } from '@angular/compiler';
import { getRomdomInt } from './number';


export function isArray(arr:any[],target:any){
    return arr.indexOf(target)!== -1;
}


//将一个数组的顺序随机打乱
export function shuffle<T>(arr: T[]):T[]{

    const result = arr.slice();
    for(let i=0;i<result.length;i++){

      const j = getRomdomInt([0,i]);

      [result[i],result[j]] = [result[j],result[i]];
    }
    return result;
}

export function getElementOffset(el: HTMLElement):{top:number;left:number;} {
    if(!el.getClientRects().length){
        return {
               top:0,
               left:0
        }
    }
    const rect = el.getBoundingClientRect();
    //ownerDocument 只读属性会返回当前节点的顶层的 document 对象，defaultView 返回关联document的window对象
    const win = el.ownerDocument.defaultView;
    return {
        top:rect.top +win.pageYOffset,
        left:rect.left+win.pageXOffset,
    }

  }
