<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // ��Ʒ�б���Ϣ
        goodsList: [],
        // ������������ʵ�ַ�ҳ
        total: 0,
        // ������
        isloading: false,
        // ������������
        queryObj: {
          // ��ѯ�ؼ���
          query: '',
          // ��Ʒ����Id
          cid: '',
          // ҳ��ֵ
          pagenum: 1,
          // ÿҳ��ʾ����������
          pagesize: 10
        }
      };
    },
    // ���ص�ǰҳ��ʱ��������
    onLoad(options) {
      // �����洢
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      this.getGoodsList()
    },
    methods: {
      async getGoodsList(cb) {
        this.isloading = true
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        // 在赋值之前做判断回调
        cb && cb()
        if (res.meta.status !== 200) return uni.$showMsg()
        // Ϊ���ݸ�ֵ
        //  = res.message.goods
        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total
        this.isloading = false

      },
      // 点击跳转
      gotoDetail(item) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      }
    },
    // 下拉刷新
    onPullDownRefresh() {
      // 重置数据
      this.queryObj.pagenum = 1,
        this.queryObj.pagesize = 10,
        this.total = 0,
        this.isloading = false,
        this.goodsList = [],
        // 2. 重新发起请求
        this.getGoodsList(() => uni.stopPullDownRefresh())
    },
    // ��������
    onReachBottom() {
      // �ж��Ƿ���������
      if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.showToast({
        title: '数据加载完毕',
        icon: 'none',
      })
      // ��ǰ�������󲻻��ٷ���
      if (this.isloading) return
      // ҳ����һ------��ȡ����----�ϲ�����
      this.queryObj.pagenum += 1,
        this.getGoodsList()
    }
  }
</script>

<style lang="scss">

</style>
