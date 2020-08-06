<template>
  <view class="upload-wrapper">
    <my-menu @openAlbum="openAlbum" @openCamera="openCamera"></my-menu>
  </view>
</template>

<script>
import Bus from "@/eventbus/index.js";

export default {
  data() {
    return {
      imgUrl: ''
    };
  },
  methods: {
    openAlbum() {
      var that = this
      wx.chooseImage({
        count: 1,
        sourceType: ['album'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          that.imgUrl = tempFilePaths[0];
          wx.navigateTo({
            url: "/pages/result/result"
          });
        }
      });
    },
    openCamera() {
      console.log(11)
      var that = this
      wx.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          that.imgUrl = tempFilePaths[0];
          wx.navigateTo({
            url: "/pages/result/result"
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
