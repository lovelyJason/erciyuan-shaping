<template>
  <view class="result-wrapper">
    <view class="img-preview">
      <view class="circle-area" :style="{ 'background-image': `url(${loadedImgUrl})` }"></view>
      <view class="scan"></view>
    </view>
    <view class="loading-text">正在检测中...</view>
    <view class="not-found-img"></view>
    <view class="not-found-text">抱歉,暂无结果😘</view>
  </view>
</template>

<script>

export default {
  data() {
    return {
      loadedImgUrl: 'http://tmp/wx54ff6e5a342e173a.o6zAJs-3uyCh1Y9k9_1PKsLagra4.Fs11o5Kdn3uUc6e7982dd33afe01962acc582ce0e694.jpg'
    }
  },
  mounted() {
  },
  methods: {
    // 检测图片是否涉黄
    checkImgSec() {

    },
    upLoadImgToOss() {
      
    }
  }
};
</script>

<style lang="less">
@keyframes move{
	to{
		background-position: 0 100%,0 0, 0 0, 0 0;
		/* 终止位置 */
		clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
	}
}
.result-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  .img-preview {
    width: 100%;
    height: 500rpx;
    position: relative;
    margin-bottom: 90rpx;
    .circle-area {
      background-color: #41b5f0;
      content: "";
      width: 160%;
      height: 570rpx;
      position: absolute;
      left: -30%;
      top: 0;
      z-index: -1;
      border-radius: 0 0 50% 50%;
      background-repeat: no-repeat;
      background-position: top center;
      // background: url("https://cdn.jsdelivr.net/gh/lovelyJason/cdn-gallery/img/a8jsi-qhapl.jpg") no-repeat top center;
      background-size: auto 100%;
    }
    .scan {
      width: 100%;
      height: calc(~"100% + 70rpx");
      background: linear-gradient(#1a98ca, #1a98ca),
        linear-gradient(90deg, #ffffff33 1px, transparent 0, transparent 19px),
        linear-gradient(#ffffff33 1px, transparent 0, transparent 19px),
        linear-gradient(transparent, #1a98ca);
      background-size: 100% 1.5%, 10% 100%, 100% 8%, 100% 100%;
      background-repeat: no-repeat, repeat, repeat, no-repeat;
      background-position: 0% 0%, 0 0, 0 0, 0 0;
      /* 初始位置 */
      clip-path: polygon(0% 0%, 100% 0%, 100% 1.5%, 0% 1.5%);
      /* 添加动画效果 */
      animation: move 2s infinite linear;
    }
  }
  .loading-text {
    text-align: center;
    font-size: 14px;
    color: #cc9966;
  }
  .not-found-img {
    width: 160px;
    height: 160px;
    background: url("https://cdn.jsdelivr.net/gh/lovelyJason/cdn-gallery/img/not_found.png")
      no-repeat center center;
    background-size: cover;
  }
  .not-found-text {
    color: #cc9966;
  }
}
</style>
