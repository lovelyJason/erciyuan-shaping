<template>
  <view class="page-wrapper">
    <view>二次元变身</view>
    <hr />
    <swiper
      class="swiper"
      circular
      :indicator-dots="indicatorDots"
      :autoplay="autoplay"
      :interval="interval"
      :duration="duration"
    >
      <swiper-item>
        <view class="swiper-item">
          <image mode="aspectFill" src="https://cdn.jsdelivr.net/gh/lovelyJason/cdn-gallery/img/下载.png"></image>
        </view>
      </swiper-item>
      <swiper-item>
        <view class="swiper-item">
          <image mode="aspectFill" src="https://cdn.jsdelivr.net/gh/lovelyJason/cdn-gallery/img/下载.jpeg"></image>
        </view>
      </swiper-item>
      <swiper-item>
        <view class="swiper-item">
          <image mode="aspectFill" src="https://cdn.jsdelivr.net/gh/lovelyJason/cdn-gallery/img/556945514.png"></image>
        </view>
      </swiper-item>
    </swiper>
    <view class="grid">
      <view class="erciyuan"></view>
    </view>
    <!-- <view class="flex-center upload-wrapper">
      <van-uploader
        :file-list="fileList"
        @after-read="afterRead"
        max-count="1"
        @delete="deleteImg"
        preview-size="200px"
      />
    </view>
    <view class="flex-center">
      <van-button :disabled="filename === ''" @click="beautifyImg" type="primary">变脸(由黄某人开发)</van-button>
    </view> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      background: ["color1", "color2", "color3"],
      indicatorDots: true,
      autoplay: true,
      interval: 2000,
      duration: 500,
      fileList: [],
      imgBase64: '',
      filename: ''
    };
  },
  methods: {
    changeIndicatorDots(e) {
      this.indicatorDots = !this.indicatorDots;
    },
    changeAutoplay(e) {
      this.autoplay = !this.autoplay;
    },
    intervalChange(e) {
      this.interval = e.detail.value;
    },
    durationChange(e) {
      this.duration = e.detail.value;
    },
    urlTobase64(url) {
      var that = this
      return new Promise((resolve, reject) => {
        wx.request({
          url: url,
          method: "GET",
          responseType: "arraybuffer",
          success: function(res) {
            let base64 = wx.arrayBufferToBase64(res.data);
            let type = url.split('.').slice(-1)[0]
            let imageBase64 = `data:image/${type};base64,` + base64;
            resolve(imageBase64)           
          }
        });

      })
    },
    afterRead(event) {
      const { file } = event.detail;
      let that = this;
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      wx.uploadFile({
        url: "http://127.0.0.1:3000/upload", // 仅为示例，非真实的接口地址
        filePath: file.path,
        name: "file",
        // formData: { user: 'test' },
        success(res) {
          // 上传完成需要更新 fileList
          if (res.statusCode === 200) {
            let { status, msg, data } = JSON.parse(res.data);
            if (status === 0) {
              const fileList = that.fileList;
              fileList.push({ ...file, url: data });
              that.fileList = fileList;
              // 存储服务端返回的filename
              var filename = data.split('/').slice(-1)[0]
              that.filename = filename
              // 转码
              let imgBase64 = that.urlTobase64(data).then(res1 => {
                that.imgBase64 = res1
              })
            }
          }
        }
      });
    },
    beautifyImg() {
      var that = this
      wx.request({
        url: 'http://127.0.0.1:3000/beautify',
        method: 'POST',
        data: {
          filename: that.filename
        },
        success: function(res) {
          console.log(res)
        }
      })
    },
    deleteImg() {
      this.fileList = [];
      this.imgBase64 = ''
      this.filename = ''
    }
  }
};
</script>

<style lang="less">
@swiper_height: 380rpx;
.page-wrapper {
  padding: 10px 20px;
  background-color: #fff;
}
.swiper {
  height: @swiper_height;
}
.swiper-item {
  display: block;
  height: @swiper_height;
  line-height: @swiper_height;
  text-align: center;
  image {
    width: 100%;
    height: 100%;
    border-radius: 20px;
  }
}
.swiper-list {
  margin-top: 40rpx;
  margin-bottom: 0;
}
.uni-common-mt {
  margin-top: 60rpx;
  position: relative;
}
.info {
  position: absolute;
  right: 20rpx;
}
.uni-padding-wrap {
  width: 550rpx;
  padding: 0 100rpx;
}
.banner-wrapper {
  // width: 100%;
  // height: 380rpx;
  // background-color: peru;
}
.flex-center {
  display: flex;
  justify-content: center;
}
.upload-wrapper {
  margin-top: 8px;
}
.van-uploader {
  .van-uploader__upload {
    margin: 0;
  }
}
.grid {
  // height: calc(~"100vh - 480rpx - 8px");
  height: calc(100vh - var(--window-top) - @swiper_height - 20px);
  background-color: #eee;
  margin-top: 8px;
  padding: 10px 20px 10px 20px;
  .erciyuan {
    width: calc(~"50% - 10px");
    height: calc(~"50% - 10px");
    background-color: #fff;
    border-radius: 12px;
  }
}
</style>
