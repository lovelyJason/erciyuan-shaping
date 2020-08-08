<template>
<uni-shadow-root class="menu-index"><view :class="'ripple-main '+(isShow?'filter':'')">
	<view class="v-content">
		
		<view class="ripple" :animation="animationData" :hidden="hidden" :style="myStyle"></view>
	</view>
</view>

<view class="bar">
	<view class="tabicon">
		<view :hidden="(!isShow)" class="menu" :style="'height:'+(CustomBar)+'px;padding-top:'+(CustomBar)+'px;'">愿每个善良的人都被世界温柔以待</view>
		<view class="bottom" :hidden="(!isShow)">
			<view v-for="(i,d) in (nav)" :key="i.index" class="navlist">
				<view v-for="(item,index) in (i.navigation)" :key="item.index" :class="'item  '+(isShow?"animation-nav":"")" :style="'animation-delay: '+((index+1)*0.1)+'s;'">
					
					<image class="item-img" mode="widthFix" :src="item.src" @click="_$self[(item.mode === 'album' ? 'openAlbum' : 'openCamera')||'_$noop']($event)">
					</image>
					<text class="string">{{item.name}}</text>
				</view>
			</view>
		</view>
	</view>
</view>
<view class="add1" :hidden="isShow">
	<view class="send"></view>
</view>
<view class="add">
	<view class="add-inner" @click="onClickAdd">
		<text :class="'add-inner-text iconfont icon-jia '+(menuStyle)"></text>
	</view>
</view></uni-shadow-root>
</template>

<script>

global['__wxRoute'] = 'menu/index'
//是否显示 默认不显示
var isShow = false,
	//动画对象实例
	animation,
	//获取当前设备的高度
	height = wx.getSystemInfoSync().windowHeight;
Component({
  properties: {
    
  },
	data: {
		// StatusBar: app.globalData.StatusBar, //状态栏高度
		// CustomBar: app.globalData.CustomBar, //titleBar高度
		hidden: true, //默认为隐藏
		isShow,
		//默认为圆形    宽高为设备高度÷15      
		myStyle: "border-radius: " +
			height + "px;height: " +
			height / 15 + "px;width: " +
			height / 15 + "px;",
		nav: [{
			navigation: [{
					name: '相机',
          src: './img/camera.png',
          mode: 'camera'
        },
        {
					name: '相册',
          src: './img/photo.png',
          mode: 'album'
        }

			],
		}]
	},
	created: function(options) {
		//初始化动画
		animation = wx.createAnimation({
			duration: 300,
			timingFunction: 'linear',
		})
	},
  methods: {
    onClickAdd: function(e) {
      var menuStyle = ''
      var that = this
      that.animation = animation
      that.setData({
        hidden: false, //隐藏白色面板(ripple)
        menuStyle: menuStyle, //设置底部加号按钮style
      })
      //判断是否显示
      if (!isShow) {
        //未显示 则执行动画 缩放设备高度÷15高度
        that.animation.scale(height / 15).step()
        //加号按钮执行打开动画
        menuStyle = 'menuOpen'
      } else {
        //已显示 则执行动画 缩放回0
        that.animation.scale(0).step()
        //加号按钮执行关闭动画
        menuStyle = 'menuClose'
      }
      isShow = !isShow //存储显示状态
      that.setData({
        animationData: that.animation.export(), //动画赋值
        menuStyle: menuStyle, //加号按钮style赋值
      })
      //如果显示状态为true 延时200毫秒后执行内容显示 否则立即隐藏
      isShow ?
        setTimeout(function() {
          that.setData({
            isShow
          })
        }, 200) : that.setData({
          isShow
        })
    },
    openAlbum: function() {
      this.triggerEvent('openAlbum')
    },
    openCamera: function() {
      this.triggerEvent('openCamera')
    }
  }
})
export default global['__wxComponents']['menu/index']
</script>
<style platform="mp-weixin">
@import './icon.css';

.ripple-main {
	height: 100%;
	/* background: url('http://pwxt9ivat.bkt.clouddn.com/ku_an.jpg') no-repeat; */
	background-size: cover;
}

.v-content {
	display: flex;
	height: 100%;
	overflow: hidden;
	text-align: center;
	position: relative;
	justify-content: center;
}

.tx {
	color: white;
	background: rgba(96,125,139,0.5);
	width: 100%;
}

.ripple {
	background-color: #f5f5f5;
	opacity: 0.85;
	position: absolute;
	z-index: 1000;
	bottom:0;
}

.bar {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: fixed;
	height: 100%;
	width: 100%;
	z-index: 1002;
	bottom: 0rpx;
}

.send {
	width: 90rpx;
	height: 90rpx;
	background: #607d8b;
	border-radius: 100%;
	display: flex;
}

.add {
	width: 100%;
	height: 90rpx;
	margin: 10rpx 0;
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	z-index: 1005;
	bottom: 5rpx;
}

.add-inner {
	display: flex;
	align-items: center;
	font-size: 35rpx;
	color: #fff;
	z-index: 1005;
	height: 90rpx;
	width: 90rpx;
	text-align: center;
	line-height: 90rpx;
}

.add-inner-text {
	width: 100%;
}

.add1 {
	width: 100%;
	height: 90rpx;
	margin: 10rpx 0;
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	z-index: 999;
	bottom: 5rpx;
}


@keyframes menuO {
	from {
		transform: rotate(0deg);
		color: #fff
	}

	to {
		transform: rotate(180deg);
		color: #000
	}
}

@keyframes menuC {
	from {
		transform: rotate(0deg);
		color: #000
	}

	to {
		transform: rotate(-180deg);
		color: #fff
	}
}

.menuOpen {
	animation: 0.3s linear 0s menuO;
	animation-fill-mode: both
}

.menuClose {
	animation: 0.3s linear 0s menuC;
	animation-fill-mode: both
}

.tabicon {
	display: flex;
	flex-direction: column;
	flex: 1;
	height: 100%;
	width: 100%;
}

.menu {
	padding: 20rpx;
	color: #607d8b;
	font-size: 30rpx;
	font-weight: 600;
	text-shadow: 5rpx 5rpx 25rpx #607d8b;
}

.bottom {
	/* background: #607d8b; */
	width: 100%;
	flex: 1;
	display: flex;
	flex-direction: column-reverse;
	padding-bottom: 110rpx;
	position: relative;
}

.bottom .navlist {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	padding-bottom: 15rpx;
}

.item {
	width: 25%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.item .item-img {
	width: 110rpx;
	height: 110rpx;
	margin-bottom: 15rpx;
	box-shadow: 0rpx 0rpx 25rpx #607d8b;
	border-radius: 100%;
}

.item .string {
	color: #607d8b;
	font-size: 25rpx;
	font-weight: 600;
	/* text-shadow: 5rpx 5rpx 25rpx #607d8b; */
}

.animation-nav {
	animation-name: bounceInDown;
	animation-duration: .45s;
	animation-timing-function: linear;
	animation-fill-mode: both
}

.filter{
	filter: blur(15rpx);
}

@keyframes bounceInDown {

	0% {
		opacity: 0;
		transform: translateY(100%)
	}

	60% {
		transform: translateY(-10%);
	}

	80% {
		transform: translateY(10%);
	}

	100% {
		opacity: 1;
		transform: translateY(0%)
	}
}
</style>