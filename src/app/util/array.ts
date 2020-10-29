import { analyzeAndValidateNgModules } from '@angular/compiler';


export function isArray(arr:any[],target:any){
    return arr.indexOf(target)!== -1;
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