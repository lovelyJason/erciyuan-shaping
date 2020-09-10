<template>
  <view class="makeup-result">
    <image :src="image" mode="widthFix"></image>
    
  </view>
</template>

<script>
export default {
  data() {
    return {
      image: 'http://algo-app-taobao-mm-cn-shanghai-prod.oss-cn-shanghai.aliyuncs.com/pixelai-portrait-makeup/2020_07_14/ea57900a3cba7677_1a0d678b8124a1c9278eb7cf673b4169.jpg?Expires=1599649931&OSSAccessKeyId=LTAI4FoLmvQ9urWXgSRpDvh1&Signature=GHt36QZKYRJDwiKamRUMzgZRfLU%3D',
      radio: 'A',

    }
  },
  onLoad(data) {
    // const { image } = data
    // this.image = image
  },
  methods: {
    RadioChange(e) {
      this.radio = e.detail.value
    }
  }
}
</script>

<style lang="less" scoped>
.makeup-result {
  padding: 0 10px;
  image {
    display: block;
    margin: 0 auto;
  }
  
}
</style>
