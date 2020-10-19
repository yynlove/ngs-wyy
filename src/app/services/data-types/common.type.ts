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
  albumSize:number;
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
  playCount:number;
  tracks:Song[];
}

