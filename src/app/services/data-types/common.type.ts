//轮播图
export type Banner = {
  targerId :number;
  url:string;
  imageUrl:string;
}

// 热门标签
export type HotTag = {
  id:number;
  name:string;
  position:number;
  useCount:number;
}



// 歌手
export type Singer ={
  id:number;
  name :string;
  picUrl:string;
  alias:string[];
  albumSize:number;
}


export type SingerDetail={
  artist:Singer;
  hotSongs: Song[];

}



//歌曲
export type Song ={
  id:number;
  name:string;
  url:string;
  ar:Singer[];
  al:{
    id:number;
    name:string;
    picUrl:string;
  },
  dt:number;
}




// 歌单
export type SongSheet = {
  id:number;
  name:string;
  picUrl:string;
  coverImgUrl:string;
  playCount:number;
  tags:string[];
  createTime:number;
  creator:{ nickname:string,avatarUrl:string };
  description:string;
  subscribedCount:number;
  shareCount:number;
  subscribed:boolean;
  commentCount:number;
  tracks:Song[];
  userId:number;

}


//歌曲播放路径
export type SongUrl ={
  id:number;
  url:string;
}



export type Lyric = {
  lyric:string; //歌词
  tlyric:string; //翻译歌词

}


//歌单
export type SheetList={
  playlists: SongSheet[],
  total:number
}



export type SearchResult={

  artists?:Singer;
  playlists?:SongSheet[];
  songs?:Song[];

}


export type sampleBack={

  code:number;
  [key:string] :any;
}
