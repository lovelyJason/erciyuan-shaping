<template>
  <view class="result-wrapper">
    <view class="img-preview">
      <!-- 初始背景图为空,请求500 -->
      <view
        class="circle-area"
        :style="{ 'background-image': `url(${loadedImgUrl})` }"
      ></view>
      <view :class="{ scan: true, 'scan-animation': !hasBack }"></view>
    </view>
    <view v-if="!hasBack" class="loading-text">正在检测中...</view>
    <view v-if="isIllegal" class="not-found-text">抱歉,暂无结果😘</view>
    <view
      class="not-found-img"
      :style="{
        'background-image': `url(${isIllegal ? notFoundImg : searchingImg})`,
      }"
    ></view>
    <view
      @click="backHome($event)"
      :class="{ 'back-home': true, disabled: !hasBack }"
    >
      <text>返回首页</text>
    </view>
    <van-dialog
      use-slot
      :show="showDialog"
      :async-close="true"
      confirmButtonText="保存到相册"
      class="img-dialog"
      @cancel="cancel"
      @confirm="saveBeautifiedImg"
      ref="dialog"
    >
      <image :src="beautifiedImgBase64" mode="widthFix"></image>
    </van-dialog>
    <view
      class="suspended-ball movable"
      id="moveDiv"
      @mousedown="utils.down"
      @touchstart="utils.down"
      @mousemove="utils.move"
      @touchmove="utils.move"
      @mouseup="utils.end"
      @touchend="utils.end"
    >
      <view @click="clickDot" id="inner"></view>
    </view>
    <view
      class="cu-modal drawer-modal justify-end"
      :class="modalName == 'DrawerModalR' ? 'show' : ''"
      @tap="hideModal"
    >
      <view
        class="cu-dialog basis-lg"
        @tap.stop=""
        :style="[{ top: 0 + 'px', height: 'calc(100vh' + 'px)' }]"
      >
        <view class="cu-list menu text-left">
          <view
            class="cu-item arrow"
            v-for="(item, index) in drawList"
            :key="index"
          >
            <view class="content">
              <view @click="onItemClick(index)">{{ item.title }}</view>
            </view>
          </view>
          <!-- 戴口罩的8种编码 -->
          <view
            :class="{
              'mask-menus': true,
              'animation-slide-bottom': showAnimation,
            }"
            :style="{display: showAnimation ? 'block' : 'none'}"
          >
            <radio-group class="block" @change="RadioChange">
              <view class="cu-form-group">
                <view class="title">1号口罩</view>
                <radio :class="radio === '1' ? 'checked' : ''" :checked="radio === '1' ? true : false" value="1"></radio>
              </view>
              <view class="cu-form-group">
                <view class="title">2号口罩</view>
                <radio :class="radio === '2' ? 'checked' : ''" :checked="radio === '2' ? true : false" value="2"></radio>
              </view>
              <view class="cu-form-group">
                <view class="title">3号口罩</view>
                <radio :class="radio === '3' ? 'checked' : ''" :checked="radio === '3' ? true : false" value="3"></radio>
              </view>
              <view class="cu-form-group">
                <view class="title">4号口罩</view>
                <radio :class="radio === '4' ? 'checked' : ''" :checked="radio === '4' ? true : false" value="4"></radio>
              </view>
              <view class="cu-form-group">
                <view class="title">5号口罩</view>
                <radio :class="radio === '5' ? 'checked' : ''" :checked="radio === '5' ? true : false" value="5"></radio>
              </view>
              <view class="cu-form-group">
                <view class="title">6号口罩</view>
                <radio :class="radio === '6' ? 'checked' : ''" :checked="radio === '6' ? true : false" value="6"></radio>
              </view>
              <view class="cu-form-group">
                <view class="title">7号口罩</view>
                <radio :class="radio === '7' ? 'checked' : ''" :checked="radio === '7' ? true : false" value="7"></radio>
              </view>
              <view class="cu-form-group">
                <view class="title">8号口罩</view>
                <radio :class="radio === '8' ? 'checked' : ''" :checked="radio === '8' ? true : false" value="8"></radio>
              </view>
            </radio-group>
            <button class="cu-btn round shadow green">重新变身</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script module="utils" lang="wxs" src="./utils.wxs"></script>

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
      filename: "", // 文件名,对应于服务器目录中上传后的文件名,
      beautifiedImgBase64: "",
      beautifiedImgTempUrl: "",
      modalName: null,
      CustomBar: this.CustomBar,
      drawList: [{ title: "什么?不满意?换个姿势?" }, { title: "戴上口罩" }],
      willAnimate: false,
      radio: '1'
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
  computed: {
    showAnimation: function() {
      if(this.modalName === 'DrawerModalR') {
        return this.willAnimate
      } else {
        // 隐藏modal后移除动画类名
        return false
      }
    }
  },

  methods: {
    // slideMenu() {
    // 没有setStyle的api
    //   var query = uni.createSelectorQuery()
    //   var view = query.select('#moveDiv')
    //   view.boundingClientRect(function(rect) {
    //     console.log(rect)
    //   }).exec()
    // },
    // 切换口罩按钮
    RadioChange(e) {
      this.radio = e.detail.value
    },
    wearMask() {
      this.willAnimate = true;
      // this.beautifyImg(this.filename);
    },
    onItemClick(index) {
      switch (index) {
        case 0:
          break;
        case 1:
          // 戴口罩
          this.wearMask();
          break;
        default:
          break;
      }
    },
    clickDot() {
      this.modalName = "DrawerModalR";
    },
    hideModal() {
      this.modalName = null;
      this.willAnimate = false
    },
    // 获取用户授权
    weAuthCheck(type = "writePhotosAlbum") {
      let resGetting = new Promise((resolve, reject) => {
        uni.getSetting({
          success: (res) => {
            // {authSetting: {scope.address: true, scope.userInfo: true, scope.writePhotosAlbum: true}
            // errMsg: "getSetting:ok"}

            if (
              res.authSetting.hasOwnProperty(`scope.${type}`) &&
              res.authSetting[`scope.${type}`]
            ) {
              resolve({
                succeeded: true,
              });
            } else {
              uni.authorize({
                scope: `scope.${type}`,
                success: () => {
                  resolve({
                    succeeded: true,
                  });
                },
                fail: (err) => {
                  reject({
                    errMsg: err.errMsg,
                  });
                },
              });
            }
          },
          fail: (err) => {
            reject({
              errMsg: err.errMsg,
            });
          },
        });
      });
      return resGetting;
    },
    // 检测图片是否涉黄
    checkImgSec() {
      // 某某操作TODO:
      return true;
    },
    // 暂时用不到,服务端转base64
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
          },
        });
      });
    },
    upLoadImgToOss(img) {
      var that = this;
      uni.uploadFile({
        url: "https://www.qdovo.com/api/upload",
        filePath: img,
        name: "file",
        success: (uploadFileRes) => {
          const { statusCode, errMsg, data } = uploadFileRes;
          console.log(uploadFileRes);
          if (statusCode === 200) {
            let { status, msg, data: imgUrl } = JSON.parse(data);
            if (status === 0) {
              let filename = imgUrl.split("/").slice(-1)[0];
              that.filename = filename;
              // 美化图片
              that.beautifyImg(filename);
              // that.urlTobase64(imgUrl).then((imgBase64Res) => {
              //   // 转码, 已在服务器根据filename匹配文件转base64,此处无需处理
              //   // that.imgBase64 = imgBase64Res
              // });
            }
          } else {
            // TODO: 换toast
            uni.showToast({
              title: errMsg,
            });
          }
        },
        fail: (err) => {
          uni.showToast({
            title: err.errMsg,
          });
        },
      });
    },
    // 保存图片到本地
    saveBeautifiedImg(e, a) {
      var that = this;
      // 如果是这样会有bug,微信默认询问一次,加上authorize询问一次
      // this.weAuthCheck().catch((err) => {
      //   if (err.errMsg.includes("auth deny")) {
      //     // 引导打开设置页,2.3.0版本之后,需要用户tap之后,才能跳转打开设置页
      //     // uni.openSetting()
      //   }
      // });
      var filePath = that.beautifiedImgTempUrl;
      wx.saveImageToPhotosAlbum({
        filePath: filePath,
        success: function(res) {
          console.log(res);
          // uni.showToast({
          //   title: "保存成功",
          // });
          that.$refs.dialog.stopLoading();
          that.showDialog = false;
        },
        fail: function(err) {
          if (!err.errMsg.includes("cancel")) {
            uni.showToast({
              title: errMsg,
            });
          }
        },
        complete: function() {
          // hide loading
        },
      });
    },
    base64ToTempUrl(base64) {
      var that = this;
      let fm = wx.getFileSystemManager();
      let startIndex = base64.indexOf("base64,") + 7;
      let filePath = wx.env.USER_DATA_PATH + `/${that.filename || "test.png"}`;
      fm.writeFile({
        filePath: filePath,
        encoding: "base64",
        data: base64.slice(startIndex),
        success: (res) => {
          // 存储最终tempUrl供保存调用
          that.beautifiedImgTempUrl = filePath;
        },
        fail: (err) => {
          console.log(err);
          // hide loading
          uni.showToast({
            title: err.errMsg,
          });
        },
      });
    },
    beautifyImg(filename, ifWearMask) {
      if (!filename) {
        uni.showToast({
          title: "请选择照片",
        });
        return;
      }
      var that = this;
      wx.request({
        url: "https://www.qdovo.com/api/beautify",
        method: "POST",
        data: {
          filename: filename || that.filename,
          ifWearMask,
        },
        success: function(res) {
          let { statusCode, errMsg, data } = res;
          if (statusCode === 200) {
            let { status, msg, data: beautifiedImgBase64 } = data;
            if (status === 0) {
              that.beautifiedImgBase64 = beautifiedImgBase64;
              console.log("show dialog");
              that.showDialog = true;
              that.hasBack = true;
              // base64转本地路径
              that.base64ToTempUrl(beautifiedImgBase64);
            }
          } else {
            uni.showToast({
              title: errMsg,
            });
          }
        },
        fail: (err) => {
          uni.showToast({
            title: err.errMsg,
          });
        },
      });
    },
    backHome(e) {
      if (!this.hasBack) return;
      uni.switchTab({
        url: "/pages/home/home",
      });
    },
  },
};
</script>

<style lang="less">
@keyframes move {
  to {
    background-position: 0 100%, 0 0, 0 0, 0 0;
    /* 终止位置 */
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
    -webkit-clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  }
}
.result-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: 100vh;
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
      background-size: 100% 1.5%, 10% 100%, 100% 8%, 100% 100%;
      background-repeat: no-repeat, repeat, repeat, no-repeat;
      background-position: 0% 0%, 0 0, 0 0, 0 0;
      /* 初始位置 */
      clip-path: polygon(0% 0%, 100% 0%, 100% 1.5%, 0% 1.5%);
      -webkit-clip-path: polygon(0% 0%, 100% 0%, 100% 1.5%, 0% 1.5%);
      /* 添加动画效果 */
      &.scan-animation {
        background-image: linear-gradient(#1a98ca, #1a98ca),
          linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.2) 1px,
            transparent 0,
            transparent 19px
          ),
          linear-gradient(
            rgba(255, 255, 255, 0.2) 1px,
            transparent 0,
            transparent 19px
          ),
          linear-gradient(transparent, #1a98ca);
        // background-image: -webkit-linear-gradient(#1a98ca, #1a98ca),
        //   -webkit-linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 0, transparent 19px),
        //   -webkit-linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 0, transparent 19px),
        //   -webkit-linear-gradient(transparent, #1a98ca);
        animation: move 2s infinite linear;
        -webkit-animation: move 2s infinite linear;
      }
    }
  }
  .loading-text {
    text-align: center;
    font-size: 30rpx;
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
    margin-top: 8px;
    &.disabled {
      opacity: 0.5;
    }
    text {
      display: block;
      width: 120px;
      height: 40px;
      background-color: #4caf50;
      text-align: center;
      line-height: 40px;
      color: #fff;
      border-radius: 6px;
    }
  }
  .img-dialog {
    image {
      max-height: calc(~"100vh - 500rpx");
    }
    .dialog-index--van-dialog {
      .van-button__text {
        font-size: 30rpx;
      }
    }
  }
}
// 悬浮球
.suspended-ball {
  @suspend-position-x: 1px;
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
  right: @suspend-position-x;
  &.wrapper-open {
    width: 30px;
    height: 120rpx;
    border-radius: 15px;
    -moz-border-radius: 15px;
    -webkit-border-radius: 15px;
    background: #fff;
    border: 1px solid #3071a9;
    right: 11px;
  }
  > view {
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
    &.menu-open {
      margin: 0;
      width: calc(~"100% - 2px");
      height: calc(~"100% - 2px");
    }
  }
}
.cu-modal {
  .mask-menus {
    width: 100%;
    // height: 200px;
    // background-color: pink;
  }
}
</style>
