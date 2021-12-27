<template>
  <!-- 搜索组件 -->
  <view class="my-search-container" :style="{'background-color': bgcolor}" @click="goSearchBox">
    <view class="my-search-box" :style="{'border-radius': radius + 'px'}">
      <!-- 图标 -->
      <uni-icons type="search" size="17"></uni-icons>
      <!-- 文本 -->
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name: "my-search",
    props: {
      bgcolor: {
        type: String,
        default: '#C00000'
      },
      // 圆角尺寸
      radius: {
        type: Number,
        // 单位是 px
        default: 18
      }
    },
    data() {
      return {

      };
    },
    methods: {
      goSearchBox() {
       // console.log('222222') 
       this.$emit('myclick')
      }
    },
  }
</script>

<style lang="scss">
  // 复用最大化颜色和圆角
  // .my-search-container {
  //   background-color: #c00000;
  //   height: 50px;
  //   padding: 0 10px;
  //   display: flex;
  //   align-items: center;
  // }

  // .my-search-box {
  //   height: 36px;
  //   background-color: #ffffff;
  //   border-radius: 15px;
  //   width: 100%;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;

  //   .placeholder {
  //     font-size: 15px;
  //     margin-left: 5px;
  //   }
  // }

  .my-search-container {
    // 移除背景颜色，改由 props 属性控制
    // background-color: #C00000;
    height: 50px;
    padding: 0 10px;
    display: flex;
    align-items: center;
  }

  .my-search-box {
    height: 36px;
    background-color: #ffffff;
    // 移除圆角尺寸，改由 props 属性控制
    // border-radius: 15px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .placeholder {
      font-size: 15px;
      margin-left: 5px;
    }
  }
</style>
