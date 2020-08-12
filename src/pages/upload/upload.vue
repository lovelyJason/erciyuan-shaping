<template>
  <view @click="handlePageClick" class="upload-wrapper">
    <my-menu ref="menu" @openAlbum="openAlbum" @openCamera="openCamera"></my-menu>
  </view>
</template>

<script>
// import Bus from "@/eventbus/index.js";

export default {
  data() {
    return {
      imgUrl: '',
      count: 0
    };
  },
  onShow() {
    // console.log(this.isDebugger)
    // this.changeDebugger(true)
    // console.log(this.isDebugger)
    // console.log('upload show')
  },
  onHide() {
    // 因为此处相册选完之后会停留在当前页,onShow和onHide都会执行一次
    // console.log('upload hide')
  },
  methods: {
    handlePageClick() {
      this.count ++
    },
    openAlbum() {
      var that = this
      uni.chooseImage({
        count: 1,
        sourceType: ['album'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          // setTimeout(() => {
          //   // 此处的bug在于下一个页面无法接受到数据,定时器可解决
          //   uni.$emit('load',{ imgUrl: tempFilePaths[0] })
          // }, 500)
          // that.$refs.menu.onClickAdd()
          // TODO: canvas压缩图片
          if(that.count >= 12) {
            that.count = 0
            that.changeDebugger(true)
          }
          console.log(that.isDebugger)
          uni.navigateTo({
            url: `/pages/result/result?img=${tempFilePaths[0]}&count=${that.count}`
          });
        }
      });
    },
    openCamera() {
      var that = this
      uni.chooseImage({
        count: 1,
        sourceType: ['camera'],
        sizeType: ['compressed'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          uni.navigateTo({
            url: `/pages/result/result?img=${tempFilePaths[0]}`
          });
        }
      });
    }
  }
};
</script>

<style lang="less">
.upload-wrapper {
  width: 100vw;
  height: 100vh;
  background: url("https://cdn.jsdelivr.net/gh/lovelyJason/cdn-gallery/img/a8jsi-qhapl.jpg")
    no-repeat center center;
  background-size: cover;
}
</style>
