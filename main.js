// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import store from './store/store.js'
// 导入网络请求的包
import {
  $http
} from '@escook/request-miniprogram'
uni.$http = $http
// 基础地址
$http.baseUrl = 'https://www.uinav.com'
/* 请求拦截 */
$http.beforeRequest = function(config) {
  // 显示loading
  uni.showToast({
    title: '数据加载中',
    icon: 'loading'
  })
}
// 响应拦截
$http.afterRequest = function() {
    // loading
    uni.hideLoading()
  },

  // 消息提示框
  uni.$showMsg = function(title = "数据请求失败", duration = 1500) {
    uni.showToast({
      title,
      icon: 'none',
    })
  }



Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
  store
})
app.$mount()
// #endif

// #ifdef VUE3
// import {
//   createSSRApp
// } from 'vue'
// import App from './App.vue'
// export function createApp() {
//   const app = createSSRApp(App)
//   return {
//     app
//   }
// }
// #endif
