<template>
  <view class="about-me">
    <view class="cu-card article" :class="isCard?'no-card':''">
			<view class="cu-item shadow">
				<view class="content">
					<view class="desc">
						<view class="text-content">
							本程序使用精密算法识别人脸并进行动漫化处理,现在仍存在很多不足,我们希望接收到您的宝贵意见,或者您希望增加的功能,可与作者密切交流😘
						</view>
						<view>
							<view class="cu-tag bg-red light sm round">二次元换装</view>
							<view class="cu-tag bg-green light sm round">免费</view>
						</view>
					</view>
				</view>
			</view>
		</view>
  </view>
</template>

<script>
export default {

}
</script>

<style lagn="less">
.content {
  padding-top: 30rpx !important;
}
</style>
