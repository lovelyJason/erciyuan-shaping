<template>
  <view
    class="suspended-ball"
    id="moveDiv"
  >
    <view></view>
  </view>
</template>

<script>
export default {
};
</script>

<style lang="less">
.suspended-ball {
  position: fixed;
  width: 50px;
  height: 50px;
  background: #3071a9;
  border-radius: 10px;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  filter: alpha(opacity=50);
  /*IE滤镜，透明度50%*/
  -moz-opacity: 0.5;
  /*Firefox私有，透明度50%*/
  opacity: 0.5;
  /*其他，透明度50%*/
  z-index: 100;
  /*最高的层级*/
  top: 10%;
  right: 1px;
  view {
    width: 30px;
    height: 30px;
    margin: 10px;
    background: #fff;
    border-radius: 15px;
    -moz-border-radius: 15px;
    -webkit-border-radius: 15px;
    filter: alpha(opacity=80);
    -moz-opacity: 0.8;
    opacity: 0.8;
    // background-image: url("/Images/Self.png");
    background-repeat: no-repeat;
    background-size: 80% auto;
    background-position-x: 50%;
    background-position-y: 50%;
  }
}
</style>
