<template>
  <view class="change-age">
    <view class="slider-row">
      <text class="label">变年轻</text>
      <van-slider class="my-slider" bar-height="4px" v-model="currentValue" use-button-slot @drag="onDrag">
        <view class="custom-button" slot="button">{{ currentValue }}</view>
      </van-slider>
      <text class="label">变老</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentValue: 22
    }
  },
  methods: {
    onDrag(e) {
      this.currentValue = e.detail.value
    }
  }
};
</script>

<style scoped lang="less">
.change-age {
  padding: 30px 20px;
  .slider-row {
    display: flex;
    justify-content: space-between;
    .label {
      display: inline-block;
      white-space: nowrap;
      font-size: 14px;
      line-height: 22px;
      color: #666;
    }
    .my-slider {
      width: calc(~"100% - 68px");
      height: 22px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: 0 28px;
      .van-slider {
        height: 100%;
      }
      .custom-button {
        width: 26px;
        color: #fff;
        font-size: 10px;
        line-height: 18px;
        text-align: center;
        background-color: #ee0a24;
        border-radius: 100px;
      }
    }
  }
}
</style>
