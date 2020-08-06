<template>
  <view>
    <div class="block__card">
      <div role="button" tabindex="0" class="erciyuan-cell erciyuan-cell--clickable">
        <div class="erciyuan-cell__title">
          <span>关于</span>
        </div>
        <i class="erciyuan-icon erciyuan-icon-arrow erciyuan-cell__right-icon"></i>
      </div>
      <div role="button" tabindex="0" class="erciyuan-cell erciyuan-cell--clickable">
        <div class="erciyuan-cell__title">
          <span>更新日志</span>
        </div>
        <i class="erciyuan-icon erciyuan-icon-arrow erciyuan-cell__right-icon"></i>
      </div>
      <div role="button" tabindex="0" class="erciyuan-cell erciyuan-cell--clickable">
        <div class="erciyuan-cell__title">
          <span>意见反馈</span>
        </div>
        <i class="erciyuan-icon erciyuan-icon-arrow erciyuan-cell__right-icon"></i>
      </div>
    </div>
  </view>
</template>

<script>
export default {};
</script>

<style lang="less">
.block__card {
  margin: 10px 12px 0;
  overflow: hidden;
  border-radius: 8px;
  .erciyuan-cell {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    box-sizing: border-box;
    width: 100%;
    padding: 10px 16px;
    overflow: hidden;
    color: #323233;
    font-size: 14px;
    line-height: 24px;
    background-color: #fff;
    .erciyuan-cell__title {
      flex: 1;
    }
    .erciyuan-icon {
      position: relative;
      display: inline-block;
      font: normal normal normal 14px/1 "vant-icon";
      font-size: inherit;
      text-rendering: auto;
      -webkit-font-smoothing: antialiased;
    }
    .erciyuan-cell__right-icon {
      margin-left: 4px;
      color: #969799;
      min-width: 1em;
      height: 24px;
      font-size: 16px;
      line-height: 24px;
    }
    &::after {
      position: absolute;
      box-sizing: border-box;
      content: " ";
      pointer-events: none;
      right: 16px;
      bottom: 0;
      left: 16px;
      border-bottom: 1px solid #ebedf0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
  }
  .erciyuan-cell--clickable {
    cursor: pointer;
  }
}
</style>
