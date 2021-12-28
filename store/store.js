import Vue from "vue"
import Vuex from "vuex"
import moduleCart from "./cart.js"
import moduleUser from "./user.js"
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    // 购物车
    m_cart: moduleCart,
    // 收货地址
    m_user: moduleUser,
  }
})
export default store
