<template>
  <view class="result-wrapper">
    <view class="img-preview">
      <!-- <view class="round left"></view>
      <view class="round right"></view> -->
    </view>
  </view>
</template>

<script>
export default {};
</script>

<style lang="less">
.img-preview {
  width: 100vw;
  height: calc(~"50vh - 20px");
  display: flex;
  justify-content: space-between;
  background: url('https://cdn.jsdelivr.net/gh/lovelyJason/cdn-gallery/img/556945514.png') no-repeat;
  background-size: cover;
  // background: #f09;
  // border-bottom: 1px solid #ccc;
  // border-radius: 49% 51% 50% 50% escape("/") 87% 87% 13% 13%;
  position: relative;
  &::after {
    background: #f09;
    content: '';
    width: 100%;
    height: 50vh;
    position: absolute;
    z-index: -1;
    border-radius: 49% 51% 50% 50% escape("/") 87% 87% 13% 13%;
    overflow: hidden;
  }
}
</style>
