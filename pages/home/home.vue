<template>
  <view>
    <!-- 轮播图 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,index) in swiperList" :key="index">
        <!-- navigator_url -->
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
          <!-- 动态绑定图片的 src 属性 -->
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 分类导航数据 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(n,i) in navList" :key="i" @click="navClickHandler(n)">
        <image :src="n.image_src" mode="" class="nav-img"></image>
      </view>
    </view>
    <!-- 楼层导航 -->
    <view class="floor-list">
      <!-- 标题 -->
      <view class="floor-item" v-for="(item,index) in floorList" :key="index">
        <image :src="item.floor_title.image_src" mode="" class="floor-title"></image>
        <!-- 图片区域 -->
        <!-- 楼层图片区域 -->
        <view class="floor-img-box">
          <!-- 左侧大图片的盒子 跳转默认第一个-->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}"
              mode="widthFix"></image>
          </navigator>
          <!-- 右侧 4 个小图片的盒子 -->
          <view class="right-img-box">
            <navigator class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" v-if="i2 !== 0"
              :url="item2.url">
              <image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 轮播图
        swiperList: [],
        // 分类导航
        navList: [],
        // 楼梯导航
        floorList: []
      };
    },
    onLoad() {
      this.getSwiperList(),
        this.getnavList(),
        this.getFloorList()
    },
    methods: {
      // 轮播图
      async getSwiperList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/swiperdata')
        // 3.2 请求失败
        if (res.meta.status !== 200) {
          return uni.$showMsg()
        }
        // 赋值
        this.swiperList = res.message
      },
      // 分类导航
      async getnavList() {
        // 
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/catitems')
        if (res.meta.status !== 200) {
          return uni.$showMsg()
        }
        this.navList = res.message
      },
      // 点击分类
      navClickHandler(item) {
        if (item.name === "分类") {
          // 编程式导航
          uni.switchTab({
            url: '/pages/cate/cate'
          })
        }
      }
      // 楼梯导航
      ,
      async getFloorList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/floordata')
        if (res.meta.status !== 200) {
          return uni.$showMsg()
        }
        // 当与后台返回的数据不一致以自身url为准
        // 添加自定义属性url不在使用navigator_url
        res.message.forEach(item => {
          item.product_list.forEach(produ => {
            produ.url = '/subpkg/goods_list/goods_list?' + produ.navigator_url.split('?')[1]
          })
        })
        this.floorList = res.message
      }


    }
  }
</script>

<style lang="scss">
  swiper {
    height: 330rpx;

    .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }

  .nav-list {
    display: flex;
    justify-content: space-around;
    margin: 15px 0;

    .nav-img {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor-title {
    height: 60rpx;
    width: 100%;
    display: flex;
  }

  .right-img-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .floor-img-box {
    display: flex;
    padding-left: 10rpx;
  }
</style>
