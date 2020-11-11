import { from, Observable, zip } from 'rxjs';
import { skip } from 'rxjs/internal/operators';
import { Lyric } from 'src/app/services/data-types/common.type';

export interface BaseLyricLine{
  txt:string;
  txtCn:string;
}

export interface LyricLine extends BaseLyricLine{
  time:number;
}

//时间正则[00:00.000] [00:00.000]
const timeExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

export class WyLycir{

  private lrc :Lyric;

  lines :LyricLine[] = [];
  constructor(lrc: Lyric){
    this.lrc = lrc;
    this.init();
  }


  init() {

    if(this.lrc.tlyric){
      //解析双语歌词
     this.generTLyric();
    }else{

      this.generLyric();

    }

  }
  generLyric() {
    const lines = this.lrc.lyric.split('\n');
    lines.forEach(line =>this.makeLine(line));
  }
  //制作每行歌词的数据
  makeLine(line: string,tline = '' ): void {
    const result = timeExp.exec(line);
    if(result){
      const txt = line.replace(timeExp,'').trim();
      const txtCn = tline ? tline.replace(timeExp,'').trim() : '';
      if(txt){
        let thirdResult = result[3] || '000';
        const len = thirdResult.length;
        const _thridResult = len > 2 ? parseInt(thirdResult) : parseInt(thirdResult) *10 ;
        const time = Number(result[1])*60*1000 + Number(result[2]) * 1000 + _thridResult;

        this.lines.push({txt,txtCn,time})
      }
    }

  }
  generTLyric() {
    //换行符将歌词分割成数组
    const lines = this.lrc.lyric.split('\n');
    const tlines = this.lrc.tlyric.split('\n').filter(item => timeExp.exec(item) !== null);
    console.log('lines',lines);
    console.log('tlines',tlines);
    //判断是原歌词长度长 还是翻译歌词长
    const moreLine = lines.length - tlines.length;
    let tempArr =[];

    if(moreLine >=0){
       tempArr = [lines,tlines];
    }else{
      tempArr = [tlines,lines];
    }
    //短歌词的第一个时间
    const first =  timeExp.exec(tempArr[1][0])[0];
    //长歌词过滤掉的索引值
    const skipIndex = tempArr[0].findIndex(item =>{
      const exec = timeExp.exec(item);
      if(exec){
        return exec[0] === first;
      }
    });
    //
    const _skip = skipIndex === -1  ? 0:skipIndex;
    //复制长数组的前n行 并制作歌词
    const skipItmes =  tempArr[0].slice(0,_skip);
    if(skipItmes.length){
      skipItmes.forEach(element => {
        this.makeLine(element);
      });
    }
    console.log('this.lines',this.lines);

    //使用zip 组装双语歌词
    let zipLines$ :Observable<[string,string]>;
    if(moreLine >0 ){
      zipLines$ = zip(from(lines).pipe(skip(_skip)),from(tlines));
    }else{
      zipLines$ = zip(from(lines),from(tlines).pipe(skip(_skip)));
    }
    zipLines$.subscribe(([line,tline]) => this.makeLine(line,tline));
  }
}
