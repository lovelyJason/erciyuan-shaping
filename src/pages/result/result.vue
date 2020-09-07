<template>
  <view class="result-wrapper">
    <view class="img-preview">
      <!-- 初始背景图为空,请求500 -->
      <view
        class="circle-area"
        :style="{
          'background-image': `url(${loadedImgUrl})`,
          'background-position': isIllegal ? 'top center' : null,
        }"
      ></view>
      <!-- true = 上传图片失败 || 黄图  || 动漫处理complete后 -->
      <view :class="{ scan: true, 'scan-animation': !hasBack }"></view>
    </view>
    <view v-if="!hasBack" class="loading-text">正在检测中,请您稍等...</view>
    <view v-if="isIllegal" class="not-found-text"
      >您的图片含有违规内容,请停止操作</view
    >
    <view v-if="uploadFlag" class="not-found-text">抱歉,暂无结果😘</view>
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
    <template v-if="apiType == 1">
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
            <van-collapse accordion :value="activeName" @change="onChange">
              <van-collapse-item title="什么?不满意?换个姿势?" name="1">
                <button
                  @click="changeStyle"
                  class="cu-btn round shadow line-red"
                >
                  换个风格
                </button>
              </van-collapse-item>
              <van-collapse-item title="戴上口罩试试" name="2">
                <!-- 戴口罩的8种编码 -->
                <view
                  :class="{
                    'mask-menus': true,
                    /*'animation-slide-bottom': showAnimation,*/
                  }"
                >
                  <radio-group class="block" @change="RadioChange">
                    <view class="cu-form-group" v-for="count in 8" :key="count">
                      <view class="title">风格{{ count + 1 }}</view>
                      <radio
                        :class="radio == count + 1 ? 'checked' : ''"
                        :checked="radio == count + 1 ? true : false"
                        :value="count + 1"
                      ></radio>
                    </view>
                  </radio-group>
                  <button
                    :disabled="beautifyNum >= 3"
                    @click="wearMask"
                    class="cu-btn round shadow line-green"
                  >
                    戴口罩
                  </button>
                  <view>
                    <text v-if="beautifyNum >= 3" style="color: #dbdee2;"
                      >您今天次数已超上限</text
                    >
                  </view>
                </view>
              </van-collapse-item>
            </van-collapse>
          </view>
        </view>
      </view>
    </template>
    <canvas
      canvas-id="canvas"
      :style="{
        width: cWidth,
        height: cHeight,
        position: 'absolute',
        left: -1000 + 'px',
        top: -1000 + 'px',
      }"
    ></canvas>
    <van-action-sheet
      v-if="apiType == 2"
      :show="showActionSheet"
      description="请选择年龄"
      class="change-age-action-sheet"
      cancel-text="确认"
      @cancel="confirmAge"
    >
      <view class="slider-row">
        <text class="label">变年轻</text>
        <van-slider
          class="my-slider"
          bar-height="4px"
          v-model="currentAge"
          use-button-slot
          @change="changeAge"
        >
          <view class="custom-button" slot="button">{{ currentAge }}</view>
        </van-slider>
        <text class="label">变老</text>
      </view>
    </van-action-sheet>
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
      filename: "", // 文件名,对应于服务器目录中上传后的文件名
      beautifiedImgBase64: "",
      beautifiedImgTempUrl: "",
      modalName: null,
      CustomBar: this.CustomBar,
      drawList: [{ title: "什么?不满意?换个姿势?" }, { title: "戴上口罩" }],
      radio: "1",
      activeName: "",
      testApi: false,
      beautifyNum: 0,
      checkImgFlag: false,
      uploadFlag: false,
      cWidth: 0,
      cHeight: 0,
      imgType: "png",
      currentAge: 18,
      ifChangeAge: false,
      apiType: 1,
      closeActionSheet: false,
      cartoornRoute1: "beautify",
      cartoornRoute2: "face-cartoon", // 默认使用腾讯
    };
  },
  async onLoad(data) {
    const that = this;
    const { img, apiType, count } = data; // tempUrl
    const imgType = img.split(".").slice(-1)[0];
    that.loadedImgUrl = img;
    that.apiType = apiType;
    that.count = count;
    // 骚操作  加 .$vm，小程序里面beforePage.changeData()可以使用，但是app上需要用beforePage.$vm.changeData()；
    var pages = getCurrentPages(); //当前页面栈
    // changeData()为父页面的方法，也就是上一页的方法。
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
      beforePage.$vm.$refs.menu.onClickAdd(); //触发父页面中的方法change()
    }
    // check之前使用canvas压缩先,否则可能失败
    // 小程序图片压缩的方法
    /*
    1. 官方接口wx.compressImage
    2. canvas重绘
    3. 安装第三方图片压缩包
    */
    if (apiType == 1) {
      this.changePicFromTempUrl(img, 1);
    } else {
      that.hasBack = true;
    }
  },
  computed: {
    showActionSheet: function() {
      if (this.closeActionSheet) {
        return false;
      } else {
        return this.apiType == 2;
      }
    },
  },
  methods: {
    confirmAge() {
      this.closeActionSheet = true;
      this.changePicFromTempUrl(this.loadedImgUrl, 2);
    },
    changeAge(e) {
      this.currentAge = e.detail !== undefined ? e.detail : e.detail.value;
    },
    /** 得到tempUrl,经过压缩,检测,上传,美化的封装
     * @img 上传或拍照后本地临时路径
     *
     */
    async changePicFromTempUrl(img, apiType) {
      const that = this;
      const imgType = img.split(".").slice(-1)[0];
      that.hasBack = false;
      try {
        let compressedImage = await that.compressImage(img);
        console.log("压缩后图", compressedImage);
        // that.loadedImgUrl = compressedImage;
        let isSafe = await that.checkImgSec(compressedImage, imgType);
        if (isSafe) {
          let filename = await that.upLoadImgToOss(img);
          if (apiType == 1) {
            await that.beautifyImg(filename);
            that.hasBack = true;
          } else {
            await that.beautifyImgByAge(filename);
            that.hasBack = true;
          }
        } else {
          that.loadedImgUrl = `https://cdn.jsdelivr.net/gh/lovelyJason/cdn-gallery/img/illegal.png`;
          that.hasBack = true;
        }
      } catch (error) {
        console.log(error);
        that.hasBack = true;
        uni.showToast({
          icon: "none",
          title: error.errMsg || "系统错误",
          duration: 3000
        });
      }
    },
    // 切换口罩按钮
    onChange(event) {
      this.activeName = event.detail;
    },
    RadioChange(e) {
      this.radio = e.detail.value;
    },
    async wearMask() {
      var that = this;
      if (this.beautifyNum >= 3) {
        return uni.showToast({
          title: "您今天的次数已超上限",
          icon: "none",
        });
      }
      if (this.isIllegal) {
        return uni.showToast({
          title: "您的图片含有违规内容,请停止操作",
          icon: "none",
        });
      }
      uni.showLoading({
        title: "正在拼命绘画",
        mask: true,
      });
      let mask_id = parseInt(this.radio); // str ===> +
      await this.beautifyImg(this.filename, mask_id, this.cartoornRoute1);
      uni.hideLoading();
    },
    clickDot() {
      this.modalName = "DrawerModalR";
    },
    hideModal() {
      this.modalName = null;
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
    compressImage(img) {
      const that = this;
      const imgType = img.split(".").slice(-1)[0];
      const size = 400; // 貌似大于100会失败
      return new Promise((resolve, reject) => {
        wx.getImageInfo({
          src: img,
          success: (res) => {
            let ratio = 2;
            let canvasWidth = res.width;
            let canvasHeight = res.height;
            if (canvasWidth <= size && canvasHeight <= size) {
              resolve(img);
            }
            while (canvasWidth > size || canvasHeight > size) {
              canvasWidth = Math.trunc(res.width / ratio);
              canvasHeight = Math.trunc(res.height / ratio);
              ratio++;
            }
            console.log("canvas", canvasWidth, canvasHeight);
            that.cWidth = canvasWidth;
            that.cHeight = canvasHeight;
            // 绘制图形并取出图片路径
            let ctx = wx.createCanvasContext("canvas");
            ctx.drawImage(res.path, 0, 0, canvasWidth, canvasHeight);
            ctx.draw(false, () => {
              setTimeout(() => {
                wx.canvasToTempFilePath(
                  {
                    canvasId: "canvas",
                    destWidth: canvasWidth,
                    destHeight: canvasHeight,
                    fileType: imgType,
                    success: (temFileRes) => {
                      const { tempFilePath } = temFileRes;
                      resolve(tempFilePath);
                    },
                    fail: (err) => {
                      reject(err);
                    },
                  },
                  that
                );
              }, 500);
            });
          },
          fail: (err) => {
            reject(err);
          },
        });
      });
    },
    // 检测图片是否涉黄
    checkImgSec(img, imgType) {
      // 某某操作
      var that = this;
      imgType = imgType || img.split(".").slice(-1)[0];
      return new Promise((resolve, reject) => {
        wx.getFileSystemManager().readFile({
          filePath: img,
          success: (buffer) => {
            wx.cloud.init();
            wx.cloud
              .callFunction({
                name: "checkImg",
                data: {
                  value: buffer.data,
                  imgType: imgType,
                },
              })
              .then((imgRes) => {
                console.log("检测结果", imgRes);
                if (imgRes.result.errCode == 87014) {
                  wx.showToast({
                    title: "图片含有违法违规内容",
                    icon: "none",
                  });
                  that.isIllegal = true; // 标记为非法黄图等
                  resolve(false);
                } else {
                  resolve(true);
                }
              })
              .catch((err) => {
                // 此处-404012 polling exceed max timeout entry 错误
                console.log("图片检测错误", err);
                reject(err);
              });
          },
          fail: (err) => {
            reject(err);
          },
          complete: () => {
            that.checkImgFlag = true;
          },
        });
      });
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
      return new Promise(function(resolve, reject) {
        // 如果做云存储,使用wx.cloud.uploadFile,拿fileID可以在云端downloadFile buffer
        // 或者使用getFileSystemManager将tempUrl转化为buffer
        uni.uploadFile({
          url: that.testApi
            ? "http://127.0.0.1:3000/api/upload"
            : "https://www.qdovo.com/api/upload",
          filePath: img,
          name: "file",
          success: (uploadFileRes) => {
            const { statusCode, errMsg, data } = uploadFileRes;
            if (statusCode === 200) {
              let { status, msg, data: imgUrl } = JSON.parse(data);
              if (status === 0) {
                let filename = imgUrl.split("/").slice(-1)[0];
                that.filename = filename;
                resolve(filename);
                // that.urlTobase64(imgUrl).then((imgBase64Res) => {
                //   // 转码, 已在服务器根据filename匹配文件转base64,此处无需处理
                //   // that.imgBase64 = imgBase64Res
                // });
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
          that.$refs.dialog.stopLoading();
          that.showDialog = false;
        },
        fail: function(err) {
          if (!err.errMsg.includes("cancel")) {
            uni.showToast({
              title: errMsg,
              icon: "none",
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
      return new Promise((resolve, reject) => {
        let fm = wx.getFileSystemManager();
        let startIndex = base64.indexOf("base64,") + 7;
        let filePath = wx.env.USER_DATA_PATH + `/${that.filename || "pic.png"}`;
        fm.writeFile({
          filePath: filePath,
          encoding: "base64",
          data: base64.slice(startIndex),
          success: (res) => {
            // 存储最终tempUrl供保存调用
            that.beautifiedImgTempUrl = filePath;
            resolve(filePath);
          },
          fail: (err) => {
            // hide loading
            reject({
              errMsg: "to tempUrl fail",
            });
            uni.showToast({
              title: err.errMsg,
              icon: "none",
            });
          },
        });
      });
    },
    /**
     * 检查图片是否已经上传过
     * @param {string} filename 必传
     */
    checkPicExit(filename) {
      return new Promise((resovle, reject) => {
        wx.request({
          url: this.testApi
            ? `http://127.0.0.1:3000/api/search-file?filename=${filename}`
            : `https://www.qdovo.com/api/search-file?filename=${filename}`,
          method: 'GET',
          success: (res) => {
            const { data: { exit } } = res
            resolve(exit)
          },
          fail: (err) => {
            reject(err)
          }
        });

      })
    },
    /**
     * 动漫化人像,接受腾讯,百度等ai接口
     * @param {string} filename 必传,此字段为上传接口返回的md5摘要.mimetype
     * @param {number} mask_id
     * @param {string} route api接口路由地址,不带'/',为了区分是哪一家的ai算法
     * @return {promise} 将接口返回的base64转化为tempUrl并打开弹窗
     */
    beautifyImg(filename, mask_id, route = this.cartoornRoute2) {
      // --- 分界线
      var that = this;
      return new Promise((resolve, reject) => {
        if (!filename) {
          uni.showToast({
            title: "请选择照片",
            icon: "none",
          });
          return;
        }
        var that = this;
        wx.request({
          url: that.testApi
            ? `http://127.0.0.1:3000/api/${route}`
            : `https://www.qdovo.com/api/${route}`,
          method: "POST",
          data: {
            filename: filename || that.filename,
            mask_id: mask_id || null,
          },
          success: async function(res) {
            let { statusCode, errMsg, data } = res;
            if (statusCode === 200) {
              let { status, msg, data: beautifiedImgBase64 } = data;
              if (status === 0) {
                that.beautifiedImgBase64 = beautifiedImgBase64; // 展示在弹窗
                that.beautifyNum++;
                // base64转本地路径,以供用户保存
                that.base64ToTempUrl(beautifiedImgBase64);
                that.showDialog = true;
                resolve(true);
              } else {
                reject({ errMsg: msg });
              }
            } else {
              reject({ errMsg });
            }
          },
          fail: (err) => {
            console.log(err);
            reject(err);
          },
          complete: () => {
            that.hasBack = true;
          },
        });
      });
    },
    beautifyImgByAge(filename) {
      var that = this;
      return new Promise((resolve, reject) => {
        if (!filename) {
          uni.showToast({
            title: "请选择照片",
            icon: "none",
          });
          return;
        }
        var that = this;
        wx.request({
          url: that.testApi
            ? "http://127.0.0.1:3000/api/change-age"
            : "https://www.qdovo.com/api/change-age",
          method: "POST",
          data: {
            filename: filename || that.filename,
            AgeInfos: [{ Age: +that.currentAge }],
            RspImgType: "base64",
          },
          success: async function(res) {
            let { statusCode, errMsg, data } = res;
            if (statusCode === 200) {
              let { status, msg, data: beautifiedImgBase64 } = data;
              if (status === 0) {
                that.beautifiedImgBase64 = beautifiedImgBase64; // 展示在弹窗
                that.beautifyNum++;
                // base64转本地路径,以供用户保存
                that.base64ToTempUrl(beautifiedImgBase64);
                that.showDialog = true;
                resolve(true);
              } else {
                reject({ errMsg: msg });
              }
            } else {
              reject({ errMsg });
            }
          },
          fail: (err) => {
            reject(err);
          },
          complete: () => {
            that.hasBack = true;
          },
        });
      });
    },
    async changeStyle() {
      if (this.beautifyNum >= 3) {
        return uni.showToast({
          title: "您今天的次数已超上限,为节约成本,联系管理员解除限制",
          icon: "none",
        });
      }
      if (this.isIllegal) {
        return uni.showToast({
          title: "您的图片含有违规内容,请停止操作",
          icon: "none",
        });
      }
      uni.showLoading({
        title: '拼命加载中',
        mask: true
      })
      await this.beautifyImg(this.filename, null, this.cartoornRoute1);
      uni.hideLoading()
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
    height: 520rpx;
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
    margin-top: 16rpx;
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
    margin-top: 16rpx;
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
.change-age-action-sheet {
  .sheet-index--van-action-sheet {
  }
  .slider-row {
    display: flex;
    justify-content: space-between;
    margin: 40rpx 40rpx 60rpx;
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
