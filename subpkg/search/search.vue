<template>
  <view>
    <view class="search-box">
      <!-- 我是搜索页面 -->
      <uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
    </view>
    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length!==0">
      <view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>




    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clean"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item, i) in historys" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 关键字
        kw: '',
        // 延时器的 timerId
        timer: null,
        // 搜索建议
        searchResults: [],
        // 搜索关键词的历史记录
        historyList: []
      };
    },
    onLoad() {
      // 持久化
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    methods: {
      input(e) {
        clearTimeout(this.timer),
          this.timer = setTimeout(() => {
            // console.log('用户的输入内容', e)
            this.kw = e
            // 搜索建议
            this.getsearchResults()
          }, 500)
      },

      async getsearchResults() {
        // 非空校验
        if (this.kw === '') {
          // 如果为空----重置searchResults
          this.searchResults = []
          return
        }
        // 发请求
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/qsearch', {
          query: this.kw
        })
        if (res.meta.status !== 200) return uni.$showMsg()
        this.searchResults = res.message
        // 1. 查询到搜索建议之后，调用 saveSearchHistory() 方法保存搜索关键词
        this.saveSearchHistory()

      },
      gotoDetail(id) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + id
        })
      },
      saveSearchHistory() {
        // this.historyList.push(this.kw)
        // 顺序问题和重复历史问题
        const set = new Set(this.historyList)
        // 清除已经存在的历史记录----删除已有的重新增加一份
        set.delete(this.kw)
        set.add(this.kw)
        this.historyList = Array.from(set)
        // 历史记录持久化
        uni.setStorageSync('kw', JSON.stringify(this.historyList))
      },
      // 清除
      clean() {
        this.historyList = []
        // 本地
        uni.setStorageSync('kw', [])
      },
      // 点击历史记录跳转
      gotoGoodsList(his){
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?query=' + kw
        })
      }
    },
    //计算属性数组的翻转让历史记录最新排序
    computed: {
      // 不可以直接改变数组地址可能导致顺序改变  
      historys() {
        return [...this.historyList].reverse()
      }
    }
  }
</script>

<style lang="scss">
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }

  .sugg-list {
    padding: 0 5px;

    .sugg-item {
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .goods-name {
        // 文字不允许换行（单行文本）
        white-space: nowrap;
        // 溢出部分隐藏
        overflow: hidden;
        // 文本溢出后，使用 ... 代替
        text-overflow: ellipsis;
        margin-right: 3px;
      }
    }
  }

  .history-box {
    padding: 0 5px;

    .history-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }

    .history-list {
      display: flex;
      flex-wrap: wrap;

      .uni-tag {
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
</style>
