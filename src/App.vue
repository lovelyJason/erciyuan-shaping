<script>
import Vue from 'vue'
export default {
  onLaunch: function() {
    console.log("App Launch");
    // #ifdef APP-PLUS
    // App平台检测升级，服务端代码是通过uniCloud的云函数实现的，详情可参考：https://ext.dcloud.net.cn/plugin?id=2226
    if (plus.runtime.appid !== "HBuilder") {
      // 真机运行不需要检查更新，真机运行时appid固定为'HBuilder'，这是调试基座的appid
      uni.request({
        url:
          "https://7a3e3fa9-7820-41d0-be80-11927ac2026c.bspapp.com/http/update", //检查更新的服务器地址
        data: {
          appid: plus.runtime.appid,
          version: plus.runtime.version,
          imei: plus.device.imei,
        },
        success: (res) => {
          if (res.statusCode == 200 && res.data.isUpdate) {
            // 提醒用户更新
            uni.showModal({
              title: "更新提示",
              content: res.data.note ? res.data.note : "是否选择更新",
              success: (ee) => {
                if (ee.confirm) {
                  plus.runtime.openURL(res.data.url);
                }
              },
            });
          }
        },
      });
    }
    // #endif

    uni.getSystemInfo({
      success: function(e) {
        // #ifndef MP
        Vue.prototype.StatusBar = e.statusBarHeight;
        if (e.platform == "android") {
          Vue.prototype.CustomBar = e.statusBarHeight + 50;
        } else {
          Vue.prototype.CustomBar = e.statusBarHeight + 45;
        }
        // #endif

        // #ifdef MP-WEIXIN || MP-QQ
        Vue.prototype.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          Vue.prototype.Custom = capsule;
          // Vue.prototype.capsuleSafe = uni.upx2px(750) - capsule.left + uni.upx2px(750) - capsule.right;
          Vue.prototype.CustomBar =
            capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          Vue.prototype.CustomBar = e.statusBarHeight + 50;
        }
        // #endif

        // #ifdef MP-ALIPAY
        Vue.prototype.StatusBar = e.statusBarHeight;
        Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
        // #endif
      },
    });
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  },
  globalData: {
    test: "",
  },
};
</script>

<style>
/* #ifndef APP-PLUS-NVUE */
/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
@import "./common/uni.css";
@import "/wxcomponents/vant/dist/common/index.wxss";
@import "/components/colorui/main.css";
@import "/components/colorui/icon.css";
@import "/components/colorui/animation.css";
@import "./common/normalize.css";
</style>
