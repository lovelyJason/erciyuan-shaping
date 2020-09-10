<template>
  <view class="beauty-makeup-bg-wrapper">
    <view class="beauty-makeup-wrapper">
      <view class="upload-desc">请上传正脸无遮挡照片</view>
      <swiper
        class="card-swiper"
        :class="dotStyle ? 'square-dot' : 'round-dot'"
        :indicator-dots="true"
        :circular="true"
        :autoplay="true"
        interval="5000"
        duration="500"
        @change="cardSwiper"
        indicator-color="#8799a3"
        indicator-active-color="#0081ff"
      >
        <swiper-item
          v-for="(item, index) in swiperList"
          :key="index"
          :class="cardCur == index ? 'cur' : ''"
          style="padding-top: 30rpx;"
        >
          <view class="swiper-item">
            <image
              :src="item.url"
              mode="aspectFill"
              v-if="item.type == 'image'"
            ></image>
            <video
              :src="item.url"
              autoplay
              loop
              muted
              :show-play-btn="false"
              :controls="false"
              objectFit="cover"
              v-if="item.type == 'video'"
            ></video>
            <text v-show="cardCur == index" class="image-desc">{{
              resourceType
            }}</text>
          </view>
        </swiper-item>
      </swiper>
      <view class="choose-img">
        <view class="camera" @click="openCamera">
          <text class="text">拍照</text>
          <view class="icon iconfont icon-paizhao"></view>
        </view>
        <view class="album" @click="openAlbum">
          <text class="text">相册</text>
          <view class="icon iconfont icon-xiangce1"></view>
        </view>
      </view>
      <view class="block">
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      dotStyle: false,
      swiperList: [
        {
          id: 0,
          type: "image",
          url:
            "https://img.alicdn.com/tfs/TB1W0yyzq61gK0jSZFlXXXDKFXa-764-1146.png",
          resourceType: "原图",
        },
        {
          id: 1,
          type: "image",
          url:
            "https://img.alicdn.com/tfs/TB1cEavzAL0gK0jSZFxXXXWHVXa-764-1146.jpg",
          resourceType: "整妆",
        },
        {
          id: 2,
          type: "image",
          url:
            "https://img.alicdn.com/tfs/TB11yWwzxv1gK0jSZFFXXb0sXXa-764-1146.jpg",
          resourceType: "基础妆",
        },
        {
          id: 3,
          type: "image",
          url:
            "https://img.alicdn.com/tfs/TB1GoSrzuT2gK0jSZFvXXXnFXXa-764-1146.jpg",
          resourceType: "少女妆",
        },
        {
          id: 4,
          type: "image",
          url:
            "https://img.alicdn.com/tfs/TB1WlGwzrH1gK0jSZFwXXc7aXXa-764-1146.jpg",
          resourceType: "活力妆",
        },
        {
          id: 5,
          type: "image",
          url:
            "https://img.alicdn.com/tfs/TB15DSrzvb2gK0jSZK9XXaEgFXa-764-1146.jpg",
          resourceType: "优雅妆",
        },
        {
          id: 6,
          type: "image",
          url:
            "https://img.alicdn.com/tfs/TB1t2CszuL2gK0jSZPhXXahvXXa-764-1146.jpg",
          resourceType: "魅惑妆",
        },
        {
          id: 7,
          type: "image",
          url:
            "https://img.alicdn.com/tfs/TB1jC5wzxD1gK0jSZFKXXcJrVXa-764-1146.jpg",
          resourceType: "梅子妆",
        },
      ],
      cardCur: 0,
      testApi: true, // TODO:
      ResourceType: 1,
      Strength: 0.8,
      ResourceTypeOption: [
        { text: '整妆', value: 0 },
        { text: '基础妆', value: 1 }
      ],
      StrengthOption: [
        { text: '0.1', value: 0.1 },
        { text: '0.8', value: 0.8 }
      ]
    };
  },
  computed: {
    resourceType: function() {
      return this.swiperList[this.cardCur].resourceType;
    },
  },
  methods: {
    onResourceTypeChange(value) {
      console.log(value)
    },
    DotStyle(e) {
      this.dotStyle = e.detail.value;
    },
    cardSwiper(e) {
      this.cardCur = e.detail.current;
    },
    openCamera() {
      var that = this;
      uni.chooseImage({
        count: 1,
        sourceType: ["camera"],
        sizeType: ["original", "compressed"],
        success(res) {
          const tempFilePaths = res.tempFilePaths;
          uni.showLoading({
            title: "拼命魔法绘制中",
            mask: true,
          });
        },
      });
    },
    openAlbum() {
      const that = this;
      uni.chooseImage({
        count: 1,
        sourceType: ["album"],
        sizeType: ["original", "compressed"],
        async success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          uni.showLoading({
            title: "拼命魔法绘制中",
            mask: true,
          });
          let filename = await that.uploadImage(tempFilePaths[0]);
          let ReqImageURL = `http://jason-gallery.oss-cn-shanghai.aliyuncs.com/erciyuan_shaping/${filename}`;
          let ResImageURL = await that.faceMakeup(ReqImageURL, 5, 0.8);
          console.log("变妆", ResImageURL);
          // let transformed_filename = ResImageURL.split("/").slice(-1)[0];
          // let showImageUrl = `http://oss.qdovo.com/erciyuan_shaping/${ResImageURL}`
          uni.hideLoading();
          wx.navigateTo({
            url: `/pages/makeup-result/makeup-result?image=${ResImageURL}`,
          });
        },
      });
    },
    uploadImage(img) {
      var that = this;
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: that.testApi
            ? "http://127.0.0.1:3000/api/ali-oss"
            : "https://www.qdovo.com/api/ali-oss",
          filePath: img,
          name: "file",
          success: (uploadFileRes) => {
            const { statusCode, errMsg, data } = uploadFileRes;
            if (statusCode === 200) {
              let { status, msg, data: ImageURL } = JSON.parse(data);
              if (status === 0) {
                resolve(ImageURL); // 全名
              } else {
                reject({
                  errMsg: msg,
                });
              }
            } else {
              reject({
                errMsg,
              });
            }
          },
          fail: (err) => {
            reject(err);
            // 上传图片到阿里云失败时标志位结束
            that.uploadFlag = true;
          },
        });
      });
    },
    faceMakeup(ImageURL, ResourceType, Strength) {
      return new Promise((resolve, reject) => {
        wx.request({
          url: this.testApi
            ? `http://127.0.0.1:3000/api/face-makeup`
            : `https://www.qdovo.com/api/face-makeup`,
          method: "POST",
          data: {
            ImageURL,
            ResourceType,
            Strength,
          },
          success: (res) => {
            let {
              data: { data: ImageURL },
            } = res;
            // console.log(ImageURL);
            resolve(ImageURL);
          },
          fail: (err) => {
            reject(err);
          },
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "./icon.css";

@swiper_height: 500rpx !important;
.beauty-makeup-bg-wrapper {
  width: 100vw;
  height: 100vh;
  background: url("https://cdn.jsdelivr.net/gh/lovelyJason/cdn-gallery/img/blue-bg.png")
    no-repeat center;
  background-size: cover;
  // opacity: 0.1;
  padding-top: 12px;
  .beauty-makeup-wrapper {
    // position: absolute;
    // width: 100%;
    // height: 100%;
    // background-color: #fff;
  }
}
.upload-desc {
  text-align: center;
  color: #fff;
  font-size: 36rpx;
}
.card-swiper {
  height: @swiper_height;
  .swiper-item {
    position: relative;
    .image-desc {
      position: absolute;
      bottom: 6px;
      right: 8px;
      color: rgba(94, 104, 104, 0.3);
    }
  }
}
.choose-img {
  margin-top: 16rpx;
  padding: 0 20rpx;
  display: flex;
  justify-content: space-between;
  .camera,
  .album {
    width: 140px;
    height: 60px;
    border-radius: 16px;
    border: 2px solid #fff;
    background-color: #d6a05b;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 32rpx;
    padding: 0 26px;
    .text {
      // text-indent: 10px;
      color: #fff;
      margin-right: 8px;
    }
    .icon {
      font-size: 40rpx;
      color: #fff;
    }
  }
}
.block {
  margin: 20px -10px;
  
}
</style>
