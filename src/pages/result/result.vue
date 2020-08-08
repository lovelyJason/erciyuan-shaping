<template>
  <view class="result-wrapper">
    <view class="img-preview">
      <view class="circle-area" :style="{ 'background-image': `url(${loadedImgUrl})` }"></view>
      <view class="scan"></view>
    </view>
    <view class="loading-text">正在检测中...</view>
    <view
      class="not-found-img"
      :style="{ 'background-image': `url(${isIllegal ? notFoundImg : searchingImg})` }"
    ></view>
    <view v-if="isIllegal" class="not-found-text">抱歉,暂无结果😘</view>
    <view v-if="!hasBack" class="back-home">
      <text @click="backHome">返回首页</text>
    </view>
     <van-dialog
      use-slot
      :show="showDialog"
      :async-close="true"
      confirmButtonText="保存到相册"
      class="img-dialog"
      @confirm="saveBeautifiedImg"
    >
     <image :src="beautifiedImgBase64"></image>
    </van-dialog>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // loadedImgUrl: 'http://tmp/wx54ff6e5a342e173a.o6zAJs-3uyCh1Y9k9_1PKsLagra4.Fs11o5Kdn3uUc6e7982dd33afe01962acc582ce0e694.jpg',
      loadedImgUrl: "",
      isIllegal: false,
      hasBack: false, // ai处理后数据是否已回来
      showDialog: false,
      notFoundImg:
        "https://cdn.jsdelivr.net/gh/lovelyJason/cdn-gallery/img/not_found.png",
      searchingImg:
        "https://cdn.jsdelivr.net/gh/lovelyJason/cdn-gallery/img/searching.png",
      filename: "",  // 文件名,对应于服务器目录中上传后的文件名,
      beautifiedImgBase64: ''
    };
  },
  onLoad(data) {
    const { img } = data;
    this.loadedImgUrl = img;
    const that = this;
    var pages = getCurrentPages(); //当前页面栈
    // 骚操作  加 .$vm，小程序里面beforePage.changeData()可以使用，但是app上需要用beforePage.$vm.changeData()；
    // changeData()为父页面的方法，也就是上一页的方法。
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
      beforePage.$vm.$refs.menu.onClickAdd(); //触发父页面中的方法change()
    }
    let isLegal = this.checkImgSec(img);
    if (isLegal) {
      this.upLoadImgToOss(img);
    }

  },
  methods: {
    // 检测图片是否涉黄
    checkImgSec() {
      // 某某操作TODO:
      return true;
    },
    urlTobase64(imgUrl) {
      var that = this;
      return new Promise((resolve, reject) => {
        uni.request({
          url: imgUrl,
          method: "GET",
          responseType: "arraybuffer",
          success: function(res) {
            let base64 = uni.arrayBufferToBase64(res.data);
            let type = imgUrl.split(".").slice(-1)[0];
            let imageBase64 = `data:image/${type};base64,` + base64;
            resolve(imageBase64);
          }
        });
      });
    },
    // 保存图片到本地
    saveBeautifiedImg() {
      uni.saveImageToPhotosAlbum({
        filePath: that.beautifiedImgBase64,
        success: function() {
          uni.showToast({
            title: '保存成功'
          });
        },
        fail: function(err) {
          uni.showToast({
            title: err.message
          });
        }
      })
    },
    beautifyImg(filename) {
      if (!filename) {
        uni.showToast({
          title: '请选择照片'
        });
        return;
      }
      var that = this;
      wx.request({
        url: "http://127.0.0.1:3000/beautify",
        method: "POST",
        data: {
          filename: filename || that.filename
        },
        success: function(res) {
          let { statusCode, errMsg, data } = res
          if(statusCode === 200) {
            let { status, msg, data: beautifiedImgBase64 } = data
            if(status === 0) {
              that.beautifiedImgBase64 = beautifiedImgBase64
              that.showDialog = true
            }
          } else {
            uni.showToast({
              title: errMsg
            });
          }
        },
        fail: err => {
          uni.showToast({
            title: err.message
          });
        }
      });
    },
    upLoadImgToOss(img) {
      var that = this;
      uni.uploadFile({
        url: "http://127.0.0.1:3000/upload",
        filePath: img,
        name: "file",
        success: uploadFileRes => {
          const { statusCode, errMsg, data } = uploadFileRes;
          if (statusCode === 200) {
            let { status, msg, data: imgUrl } = JSON.parse(data);
            if(status === 0) {
              let filename = imgUrl.split("/").slice(-1)[0];
              that.filename = filename;
              // 转码
              that.urlTobase64(imgUrl).then(imgBase64Res => {
                // that.imgBase64 = imgBase64Res
                // 美化图片
                that.beautifyImg(filename);
              });
            }
          } else {
            // TODO: 换toast
            uni.showToast({
              title: errMsg
            });
          }
        },
        fail: err => {
          uni.showToast({
              title: err.message
          });
        }
      });
    },
    backHome() {
      uni.switchTab({
        url: "/pages/home/home"
      });
    }
  }
};
</script>

<style lang="less">
@keyframes move {
  to {
    background-position: 0 100%, 0 0, 0 0, 0 0;
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
      // background-color: #41b5f0;
      content: "";
      width: 160%;
      height: 570rpx;
      position: absolute;
      left: -30%;
      top: 0;
      z-index: -1;
      border-radius: 0 0 50% 50%;
      border-bottom: 1px solid #bdbdbd;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 100% auto;
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
    margin-top: 8px;
  }
  .not-found-img {
    width: 160px;
    height: 160px;
    // background: url("https://cdn.jsdelivr.net/gh/lovelyJason/cdn-gallery/img/not_found.png")
    // background: url("https://cdn.jsdelivr.net/gh/lovelyJason/cdn-gallery/img/searching.png") no-repeat center center;
    background-size: cover;
  }
  .not-found-text {
    color: #cc9966;
  }
  .back-home {
    text {
      display: block;
      width: 120px;
      height: 40px;
      background-color: #4caf50;
      text-align: center;
      line-height: 40px;
      color: #fff;
      border-radius: 6px;
      margin-top: 8px;
    }
  }
  .img-dialog {
    .dialog-index--van-dialog {

    }
  }
}
</style>
