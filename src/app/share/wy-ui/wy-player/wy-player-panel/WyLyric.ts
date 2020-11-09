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
    console.log('this.lines',this.lines);

  }
  //制作每行歌词的数据
  makeLine(line: string): void {
    const result = timeExp.exec(line);
    if(result){
      const txt = line.replace(timeExp,'').trim();
      const txtCn = '';
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
    throw new Error('Method not implemented.');
  }
}
