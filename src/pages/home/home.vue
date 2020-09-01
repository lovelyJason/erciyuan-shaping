<template>
  <view class="page-wrapper">
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
          <image
            mode="aspectFill"
            src="https://cdn.jsdelivr.net/gh/lovelyJason/cdn-gallery/img/下载.png"
          ></image>
        </view>
      </swiper-item>
      <swiper-item>
        <view class="swiper-item">
          <image
            mode="aspectFill"
            src="https://cdn.jsdelivr.net/gh/lovelyJason/cdn-gallery/img/下载.jpeg"
          ></image>
        </view>
      </swiper-item>
      <swiper-item>
        <view class="swiper-item">
          <image
            mode="aspectFill"
            src="https://cdn.jsdelivr.net/gh/lovelyJason/cdn-gallery/img/556945514.png"
          ></image>
        </view>
      </swiper-item>
    </swiper>
    <uni-grid :column="3" :show-border="false" @change="handleGridClick">
      <uni-grid-item index="0">
        <view class="shaping erciyuan"></view>
        <text class="text">变脸</text>
      </uni-grid-item>
      <uni-grid-item index="1">
        <view class="shaping change-age"></view>
        <text class="text">变年龄</text>
      </uni-grid-item>
      <uni-grid-item index="2">
        <view class="shaping change-gender"></view>
        <text class="text">变性别</text>
      </uni-grid-item>
    </uni-grid>
    <!-- <view class="grid">
      <view class="erciyuan"></view>
      <view class="shaping-title">变脸</view>
    </view> -->
    <van-dialog
      use-slot
      title="上传清晰照结果更明显哦"
      :show="show"
      show-cancel-button
      :async-close="asyncClose"
      @cancel="cancel"
      @confirm="beautifyImg"
    >
      <view class="grid flex-center upload-wrapper">
        <van-uploader
          :file-list="fileList"
          @after-read="afterRead"
          max-count="1"
          @delete="deleteImg"
          preview-size="80px"
        />
      </view>
    </van-dialog>
    <van-toast id="van-toast" />
  </view>
</template>

<script>
import Toast from "@/wxcomponents/vant/dist/toast/toast.js";

export default {
  data() {
    return {
      background: ["color1", "color2", "color3"],
      indicatorDots: true,
      autoplay: true,
      interval: 3000,
      duration: 500,
      fileList: [],
      imgBase64: "",
      filename: "",
      show: false,
      asyncClose: true,
    };
  },
  onLoad() {
    // const ctx = wx.createCanvasContext('myCanvas')
    // ctx.setFillStyle('red')
    // ctx.fillRect(10, 10, 150, 75)
    // ctx.draw()

    // 测试云函数
    // this.testCloudFunction();
  },
  methods: {
    testCloudFunction() {
      var content = '法轮功'
      wx.cloud.init()
      wx.cloud
        .callFunction({
          name: "checkMsg",
          data: {
            content: content,
          },
        })
        .then((res) => {
          console.log(res.result);
          if (res.result.code == 300) {
            uni.showModal({
              title: "温馨提示",
              content:
                "你所输入的内容可能含有违法违规内容，不支持进行下一步操作",
            });
            return;
          } else {
          }
        });
    },
    handleGridClick({ detail: { index } }) {
      if (index === 0) {
        wx.navigateTo({
          url: "/pages/upload/upload?apiType=1"
        });
      } else if(index === 1) {
        // uni.showToast({
        //   icon: 'none',
        //   title: '该功能正在开放中,请稍后'
        // })
        uni.navigateTo({
          url: `/pages/upload/upload?apiType=2`
        });
      } else if(index === 2) {
        uni.showToast({
          icon: 'none',
          title: '该功能正在开放中,敬请期待'
        })
      }
    },
    cancel() {
      this.show = false;
    },
    intervalChange(e) {
      this.interval = e.detail.value;
    },
    durationChange(e) {
      this.duration = e.detail.value;
    },
    urlTobase64(url) {
      var that = this;
      return new Promise((resolve, reject) => {
        wx.request({
          url: url,
          method: "GET",
          responseType: "arraybuffer",
          success: function(res) {
            let base64 = wx.arrayBufferToBase64(res.data);
            let type = url.split(".").slice(-1)[0];
            let imageBase64 = `data:image/${type};base64,` + base64;
            resolve(imageBase64);
          },
        });
      });
    },
    afterRead(event) {
      const { file } = event.detail;
      console.log(file);
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
              var filename = data.split("/").slice(-1)[0];
              that.filename = filename;
              // 转码
              let imgBase64 = that.urlTobase64(data).then((res1) => {
                that.imgBase64 = res1;
              });
            }
          }
        },
      });
    },
    beautifyImg() {
      if (!this.filename) {
        Toast("请选择照片");
        return;
      }
      var that = this;
      // wx.navigateTo('')
      // wx.request({
      //   url: 'http://127.0.0.1:3000/beautify',
      //   method: 'POST',
      //   data: {
      //     filename: that.filename
      //   },
      //   success: function(res) {
      //     that.show = false
      //   }
      // })
    },
    deleteImg() {
      this.fileList = [];
      this.imgBase64 = "";
      this.filename = "";
    },
  },
};
</script>

<style lang="less">
@swiper_height: 460rpx;
.page-wrapper {
  // padding: 10px 20px;
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
    // border-radius: 20px;
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
  .van-uploader {
    .van-uploader__upload {
      margin: 0;
    }
  }
}
.grid {
  // height: calc(~"100vh - 480rpx - 8px");
  height: calc(100vh - var(--wcindow-top) - @swiper_height - 20px);
  background-color: #eee;
  margin-top: 8px;
  padding: 10px 20px 10px 20px;
}
.uni-grid-wrap {
  margin-top: 8px;
  height: calc(100vh - var(--window-top) - @swiper_height - 20px);
  padding: 10px 20px 10px 20px;
}
.uni-grid-item__box {
  align-items: center;
}
.shaping {
  width: calc(~"100% - 25px");
  height: calc(~"100% - 25px");
  background: url("https://cdn.jsdelivr.net/gh/lovelyJason/cdn-gallery/img/timg-128421521.jpeg")
    no-repeat;
  background-size: cover;
  background-color: #fff;
  border-radius: 12px;
  @deg: -5deg;
  transform: rotate(@deg);
  &.change-age {
    background: url("https://cdn.jsdelivr.net/gh/lovelyJason/cdn-gallery/img/change-age.jpg") no-repeat center center;
    transform: rotate(-@deg);
  }
  &.change-gender {
    background: url("https://cdn.jsdelivr.net/gh/lovelyJason/cdn-gallery/img/p6318591.jpg") no-repeat center center;
    transform: rotate(@deg);
  }
}
.text {
  margin-top: 6px;
  text-align: center;
}
#myCanvas {
  width: 600px;
  height: 300px;
}
</style>
