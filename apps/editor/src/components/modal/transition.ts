const _setHeightZero = (el: HTMLElement) => (el.style.height = "0px");
const _setHeightScroll = (el: HTMLElement) =>
  (el.style.height = `${el.scrollHeight}px`);
const _setHeightEmpty = (el: HTMLElement) => (el.style.height = "");
const _setOverflowHidden = (el: HTMLElement) => (el.style.overflow = "hidden");
const _setOverflowEmpty = (el: HTMLElement) => (el.style.overflow = "");

const transitionEvents: Record<string, (el: HTMLElement) => void> = {
  //在元素被插入到 DOM 之前被调用,设为零
  beforeEnter(el) {
    _setHeightZero(el);
    _setOverflowHidden(el);
  },
  //在元素被插入到 DOM 之后的下一帧被调用，设置显示高度
  enter: (el) => _setHeightScroll(el),
  //当进入过渡完成时调用,恢复原始
  afterEnter(el) {
    _setHeightEmpty(el);
    _setOverflowEmpty(el);
  },
  //在 leave 钩子之前调用，为包裹元素设置高度
  beforeLeave(el) {
    _setHeightScroll(el);
    _setOverflowHidden(el);
  },
  // 开始离开动画
  leave: (el) => _setHeightZero(el),
  // 恢复默认值：在离开过渡完成,且元素已从 DOM 中移除时调用,
  afterLeave(el) {
    _setHeightEmpty(el);
    _setOverflowEmpty(el);
  },
};

export default transitionEvents;