//是否显示 默认不显示
var isShow = false,
	//动画对象实例
	animation,
	//获取当前设备的高度
	height = wx.getSystemInfoSync().windowHeight;
Component({
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
					src: './img/camera.png'
        },
        {
					name: '相册',
					src: './img/photo.png'
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
  }
})
