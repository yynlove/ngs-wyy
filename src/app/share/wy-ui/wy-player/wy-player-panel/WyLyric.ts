import { from, Observable, Subject, Subscription, timer, zip } from 'rxjs';
import { skip } from 'rxjs/internal/operators';
import { Lyric } from 'src/app/services/data-types/common.type';

export interface BaseLyricLine{
  txt: string;
  txtCn: string;
}

export interface LyricLine extends BaseLyricLine{
  time: number; // 单位：ms
}

export interface Handler extends BaseLyricLine{
  lineNum: number; // 当前歌词的索引
}


// 时间正则[00:00.000] [00:00.000]
const timeExp = /\[(\d{2}):(\d{2})(?:\.\d{2,3})?\]/;

export class WyLycir{



  private lrc: Lyric;
  // 播放状态
  private playing = false;
  // 当前播放的第几行歌词
  private curNum: number;
  // 当前播放时间戳
  private startTemp: number;
  // 暂停的时间
  private pausetemp: number;
  private timer$: Subscription;
  // 订阅一个主题
  handler = new Subject<Handler>();

  lines: LyricLine[] = [];
  constructor(lrc: Lyric){
    this.lrc = lrc;
    this.init();
  }


  init() {

    if (this.lrc.tlyric){
      // 解析双语歌词
     this.generTLyric();
    }else{

      this.generLyric();

    }

  }
  generLyric() {
    const lines = this.lrc.lyric.split('\n');
    lines.forEach(line => this.makeLine(line));
  }
  // 制作每行歌词的数据
  makeLine(line: string, tline = '' ): void {
    const result = timeExp.exec(line);
    if (result){
      const txt = line.replace(timeExp, '').trim();
      const txtCn = tline ? tline.replace(timeExp, '').trim() : '';
      if (txt){
        const thirdResult = result[3] || '000';
        const len = thirdResult.length;
        const _thridResult = len > 2 ? parseInt(thirdResult) : parseInt(thirdResult) * 10 ;
        const time = Number(result[1]) * 60 * 1000 + Number(result[2]) * 1000 + _thridResult;

        this.lines.push({txt, txtCn, time});
      }
    }

  }
  generTLyric() {
    // 换行符将歌词分割成数组
    const lines = this.lrc.lyric.split('\n');
    const tlines = this.lrc.tlyric.split('\n').filter(item => timeExp.exec(item) !== null);
   // console.log('lines',lines);
    // console.log('tlines',tlines);
    // 判断是原歌词长度长 还是翻译歌词长
    const moreLine = lines.length - tlines.length;
    let tempArr = [];

    if (moreLine >= 0){
       tempArr = [lines, tlines];
    }else{
      tempArr = [tlines, lines];
    }
    // 短歌词的第一个时间
    const first =  timeExp.exec(tempArr[1][0])[0];
    // 长歌词过滤掉的索引值
    const skipIndex = tempArr[0].findIndex(item => {
      const exec = timeExp.exec(item);
      if (exec){
        return exec[0] === first;
      }
    });
    //
    const _skip = skipIndex === -1  ? 0 : skipIndex;
    // 复制长数组的前n行 并制作歌词
    const skipItmes =  tempArr[0].slice(0, _skip);
    if (skipItmes.length){
      skipItmes.forEach(element => {
        this.makeLine(element);
      });
    }
    // console.log('this.lines',this.lines);

    // 使用zip 组装双语歌词
    let zipLines$: Observable<[string, string]>;
    if (moreLine > 0 ){
      zipLines$ = zip(from(lines).pipe(skip(_skip)), from(tlines));
    }else{
      zipLines$ = zip(from(lines), from(tlines).pipe(skip(_skip)));
    }
    zipLines$.subscribe(([line, tline]) => this.makeLine(line, tline));
  }

  // 播放歌词
  play(startTime = 0 , skip= false) {
    if (!this.lines.length) { return; }
    if (!this.playing){
      this.playing = true;
    }

    this.curNum = this.findCurNum(startTime);
    console.log('this.curNum', this.curNum);
    // startTime 已经播放的过的时间戳长度
    // startTemp 歌曲重新开始播放的时间戳

    this.startTemp = Date.now() - startTime;
    if (!skip){
      /**
       * 发射过来的值是正在播放的时间大于这行开始的时间
       * 得到的行数是正在播放的行数的下一行
       */
      this.callHandler(this.curNum - 1);
    }

    if (this.curNum < this.lines.length){
      // 清除定时器
      // clearTimeout(this.timer);
     this.clearTimer();
     this.playReset();

    }
  }



  private clearTimer(){
    this.timer$ && this.timer$.unsubscribe();
  }

  // 继续播放
  playReset() {
    const line = this.lines[this.curNum];
    // 播放介素剩余的ms数
   // console.log("Date.now",Date.now())
    const delay = line.time - (Date.now() - this.startTemp);
    // 边播放便延迟把当前的歌词发射出去
    this.timer$ = timer(delay).subscribe(() => {
      this.callHandler(this.curNum++);
      if (this.curNum < this.lines.length && this.playing){
        this.playReset();
      }
    });
    // this.timer = setTimeout(() =>{
    //   this.callHandler(this.curNum++);
    //   if(this.curNum <this.lines.length && this.playing){
    //     this.playReset();
    //   }
    // },delay)

  }

  callHandler(i: number) {
    // 等待dom  延迟进行发射
    if (i > 0){
      this.handler.next({
        txt: this.lines[i].txt,
        txtCn: this.lines[i].txtCn,
        lineNum: i
      });
    }
  }


  // 根据时间计算当前播放行
  findCurNum(startTime: number): number {
    const index = this.lines.findIndex(item => startTime <= item.time);
    return index === -1 ? this.lines.length - 1 : index;
  }


  // 暂停播放
  togglePlay(playing: boolean) {
    const now = Date.now();
    this.playing = playing;
    if (playing){
      const startTime = (this.pausetemp || now) - (this.startTemp || now);
      this.play(startTime, true);
    }else{
      this.stop();
      this.pausetemp = now;
    }
  }
  // 暂停播放
  stop() {
    if (this.playing){
      this.playing = false;
    }
    // clearTimeout(this.timer);
    this.clearTimer();
  }

  // 跳转
  seek(timer: number){
    this.play(timer);
  }
}
