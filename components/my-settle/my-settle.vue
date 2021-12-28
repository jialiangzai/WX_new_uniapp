<template>
  <!-- 最外层的容器 -->
  <view class="my-settle-container">
    <!-- 全选区域 -->
    <label class="radio" @click="changeAllState">
      <radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
    </label>

    <!-- 合计区域 -->
    <view class="amount-box">
      合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
    </view>

    <!-- 结算按钮 -->
    <view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
  </view>
</template>

<script>
  import {
    mapGetters,
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    name: "my-settle",
    computed: {
      // 选中商品数量，总数量，选中商品的总价
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
      // addstr 是详细的收货地址
      ...mapGetters('m_user', ['addstr']),
      // token 是用户登录成功之后的 token 字符串
      ...mapState('m_user', ['token']),
      ...mapState('m_cart', ['cart']),
      // 全选按钮的状态
      isFullCheck() {
        return this.checkedCount === this.total
      },
    },
    data() {
      return {
        sec: 3,
        timer: null
      };
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      ...mapMutations('m_user', ['updateRedirectInfo']),
      changeAllState() {
        this.updateAllGoodsState(!this.isFullCheck)
      },
      // 点击结算按钮----选中商品+地址+登录
      settlement() {
        if (!this.checkedCount) {
          return uni.$showMsg('请选择要结算的商品！')
        }
        if (!this.addstr) {
          return uni.$showMsg('请选择收货地址！')
        }
        // if (!this.token) {
        //   return uni.$showMsg('请先登录！')
        // }
        if (!this.token) {
          return this.delayNavigate()
        }
        // 实现微信支付功能
        this.payOrder()
      },
      // 定时器----三秒延时
      delayNavigate() {
        // sec 秒数不会被重置，导致第 2 次，3 次，n 次 的倒计时跳转功能无法正常工作
        // 把 data 中的秒数重置成 3 秒----初始化
        this.sec = 3
        this.showTips(this.sec)
        this.timer = setInterval(() => {
          //递减-----注意顺序
          this.sec--
          // 定时器
          if (this.sec <= 0) {
            this.timer && clearInterval(this.timer)
            // 跳转到登录页

            setTimeout(() => {
              uni.switchTab({
                url: '/pages/my/my',
                // 接口调用成功的回调函数
                success: () => {
                  this.updateRedirectInfo({
                    // 跳转的方式 
                    swtype: 'switchTab',
                    // 从哪个页面跳转过去的
                    from: '/pages/cart/cart'
                  })
                }
              })
            }, 500)
            return
          }

          this.showTips(this.sec)
        }, 1000)
      },
      // 消息弹层
      showTips(n) {
        uni.showToast({
          title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
          duration: 1000,
          //  为页面添加透明遮罩，防止点击穿透
          mask: true,
          icon: 'none',
        })
      },
      // 1.订单
      async payOrder() {
        // 定义参数对象
        const orderInfo = {
          // 开发期间，注释掉真实的订单价格，
          // order_price: this.checkedGoodsAmount,
          // 写死订单总价为 1 分钱
          order_price: 0.01,
          consignee_addr: this.addstr,
          goods: this.cart.filter(x => x.goods_state).map(x => ({
            goods_id: x.goods_id,
            goods_number: x.goods_count,
            goods_price: x.goods_price
          }))
        }
        // 1.2 发起请求创建订单
        const {
          data: res
        } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
        // 1.3 得到服务器响应的“订单编号”
        const orderNumber = res.message.order_number

        // 2. 订单预支付
        // 2.1 发起请求获取订单的支付信息
        const {
          data: res2
        } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {
          order_number: orderNumber
        })
        // 2.2 预付订单生成失败
        if (res2.meta.status !== 200) return uni.$showError('预付订单生成失败！')
        // 2.3 得到订单支付相关的必要参数
        const payInfo = res2.message.pay
        // 3. 发起微信支付
        // 3.1 调用 uni.requestPayment() 发起微信支付
        const [err, succ] = await uni.requestPayment(payInfo)
        // 3.2 未完成支付
        if (err) return uni.$showMsg('订单未支付！')
        // 3.3 完成了支付，进一步查询支付的结果
        const {
          data: res3
        } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {
          order_number: orderNumber
        })
        // 3.4 检测到订单未支付
        if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
        // 3.5 检测到订单支付完成
        uni.showToast({
          title: '支付完成！',
          icon: 'success'
        })
      }
    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    /* 底部固定定位 */
    position: fixed;
    bottom: 0;
    left: 0;
    /* 设置宽高和背景色 */
    width: 100%;
    height: 50px;
    // 将背景色从 cyan 改为 white
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 5px;
    font-size: 14px;

    .radio {
      display: flex;
      align-items: center;
    }

    .amount {
      color: #c00000;
    }

    .btn-settle {
      height: 50px;
      min-width: 100px;
      background-color: #c00000;
      color: white;
      line-height: 50px;
      text-align: center;
      padding: 0 10px;
    }
  }
</style>
