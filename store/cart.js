export default {
  // 开启命名空间
  namespaced: true,
  state: () => ({
    // 购物车数据
    // 每个商品对象都必须要包含的留个属性
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),
  mutations: {
    addToCart(state, goods) {
      // console.log('传递到vuex中的数据', goods)
      // 存在数量加一不存在push
      const cartGoods = state.cart.find(x => x.goods_id === goods.goods_id)
      if (!cartGoods) {
        // push
        state.cart.push(goods)
      } else {
        cartGoods.goods_count++
      }
      // console.log(state.cart)
      // 数据持久化
      this.commit('m_cart/saveToStorage')
    },
    // 持久化存储
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 点击修改选中状态
    updateGoodsState(state, goods) {
      const findGoodSel = state.cart.find(x => x.goods_id === goods.goods_id)
      if (findGoodSel) {
        findGoodSel.goods_state = goods.goods_state
      }
      // 持久化存储到本地
      this.commit('m_cart/saveToStorage')
    },
    // 更新购物车中商品的数量
    updateGoodsCount(state, goods) {
      // 根据 goods_id 查询购物车中对应商品的信息对象
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

      if (findResult) {
        // 更新对应商品的数量
        findResult.goods_count = goods.goods_count
        // 持久化存储到本地
        this.commit('m_cart/saveToStorage')
      }
    }, // 根据 Id 从购物车中删除对应的商品信息
    removeGoodsById(state, goods_id) {
      // console.log(goods_id)
      // 调用数组的 filter 方法进行过滤
      state.cart = state.cart.filter(x => x.goods_id !== goods_id)
      // 持久化存储到本地
      this.commit('m_cart/saveToStorage')
    },
    // 全选或反选
    // 更新所有商品的勾选状态
    updateAllGoodsState(state, newState) {
      // 循环更新购物车中每件商品的勾选状态
      state.cart.forEach(x => x.goods_state = newState)
      // 持久化存储到本地
      this.commit('m_cart/saveToStorage')
    }
  },
  getters: {
    total(state) {
      // let c = 0
      // // reduce也是可以
      // state.cart.forEach(m => c += m.goods_count)
      // return c
      return state.cart.reduce((m, n) => (m += n.goods_count), 0)
    },
    // 结算数量
    checkedCount(state) {
      return state.cart.filter(x => x.goods_state === true).reduce((sum, item) => (sum += item.goods_count), 0)
    },
    // 选中结算
    checkedGoodsAmount(state) {
      // 过滤----累加
      return state.cart.filter(x => x.goods_state).reduce((sum, num) => (sum += num.goods_count * num
        .goods_price), 0).toFixed(2)
    }
  },
  actions: {}
}
