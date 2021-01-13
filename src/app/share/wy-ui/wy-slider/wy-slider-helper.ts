// 阻止滑动条冒泡
export function sliderEvent(e: Event){
  (e: Event) => {
    // 阻止冒泡
    e.stopPropagation();
    e.preventDefault();
  };
}
