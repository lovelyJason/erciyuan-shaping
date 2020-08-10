<template>
  <view class="history">
     <view class="cu-card article" :class="isCard?'no-card':''">
			<view class="cu-item shadow">
        <view class="custom-title">
          版本: v1.0.0
        </view>
				<view class="content">
					<view class="desc">
						<view class="text-content">
              <p>1.开发中...</p>
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

<style lang="less">
.history {
  .cu-item {
    padding-top: 30rpx;
    .custom-title {
      text-align: center;
      color: rgba(69, 90, 100, 0.6);
    }
    .content {
      padding-top: 30rpx !important;
      .text-content {
        height: auto !important;
        min-height: 4.8em;
      }
    }
  }
}
</style>
