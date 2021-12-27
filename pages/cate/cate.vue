<template>
  <view>
    <!-- 搜索组件 -->
    <my-search @myclick="goSearch"></my-search>
    <view class="scroll-view-container">
      <!-- 左侧的滚动视图区域 -->
      <scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
        <!-- block -->
        <block v-for="(item,index) in cateList" :key="index">
          <view class="left-scroll-view-item " :class="{active:index===active?'active':''}"
            @click="activeChanged(index)">{{item.cat_name}}</view>
        </block>
      </scroll-view>
      <!-- 右侧的滚动视图区域 -->
      <scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item2,index2) in cateLevel2" :key="index2">
          <!-- 二级标题 -->
          <view class="cate-lv2-title">
            / {{item2.cat_name}} /
          </view>
          <!-- 二级标题下的三级分类列表 -->
          <view class="cate-lv3-list">
            <!-- 单项 -->
            <view class="cate-lv3-item" v-for="(item3,index3) in item2.children" :key="index3"
              @click="gotoGoodsList(item3)">
              <!-- 图片 -->
              <image :src="item3.cat_icon" mode=""></image>
              <!-- 文本 -->
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
        wh: 0,
        // 分类列表数据
        cateList: [],
        // 一级列表选中项
        active: 0,
        // 二级分类列表
        cateLevel2: [],
        // 滚动条距离顶部的距离
        scrollTop: 0
      };
    },
    onLoad() {
      // 获取当前系统的信息
      const sysInfo = uni.getSystemInfoSync()
      // 为 wh 窗口可用高度动态赋值减去搜索组件高度避免显示不完整
      this.wh = sysInfo.windowHeight - 50
      // 调用方法
      this.getCateList()
    },
    methods: {
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories')
        // 判断是否获取失败
        if (res.meta.status !== 200) return uni.$showMsg()
        // 转存数据
        this.cateList = res.message
        // 二级
        this.cateLevel2 = res.message[0].children
      },
      // 点击单项获取Active
      activeChanged(n) {
        this.active = n,
          // 切换左侧分类重新为二级分类赋值
          this.cateLevel2 = this.cateList[n].children
        // 动态设置右侧列表滚动开始位置
        this.scrollTop === 0 ? 1 : 0
      },
      gotoGoodsList(url) {
        uni.navigateTo({
          // 跳转到分类下的商品列表
          url: '/subpkg/goods_list/goods_list?cid=' + url.cat_id
        })
      },
      // 点击跳转
      goSearch(){
        // console.log('我是父级')
        uni.navigateTo({
          url:'/subpkg/search/search'
        })
      }
    },
  }
</script>
<style lang="scss">
  // 美化页面结构：
  .scroll-view-container {
    display: flex;

    .left-scroll-view {
      width: 120px;

      .left-scroll-view-item {
        line-height: 60px;
        background-color: #f7f7f7;
        text-align: center;
        font-size: 12px;

        // 激活项的样式
        &.active {
          background-color: #ffffff;
          position: relative;

          // 渲染激活项左侧的红色指示边线
          &::before {
            content: ' ';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #c00000;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }
  }

  .cate-lv2-title {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }

  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;

    .cate-lv3-item {
      width: 33.33%;
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;

      image {
        width: 60px;
        height: 60px;
      }

      text {
        font-size: 12px;
      }
    }
  }
</style>
