<template>
  <view class="login-container">
    <!-- 提示登录的图标 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- 登录按钮 -->
    <button type="primary" class="btn-login" @click="login">一键登录</button>

    <!-- 登录提示 -->
    <view class="tips-text">登录后尽享更多权益</view>
  </view>
</template>

<script>
  import {
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    name: "my-login",
    data() {
      return {

      };
    },
    computed: {
      ...mapState('m_user', ['redirectInfo'])
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      async login() {
        // 获取用户登录信息
        // 描述
        const [err, succ] = await uni.getUserProfile({
          desc: '登录'
        })

        if (err !== null) {
          return uni.$showMsg('获取用户登录信息失败')
        }
        this.updateUserInfo(succ.userInfo)
        // 存储到vuex-----res中第一层不是渲染页面的 userinfo才是渲染页面登录人的信息的
        // 调接口获取token
        const [loginerr, codeObj] = await uni.login()
        if (loginerr !== null) return uni.$showMsg('登录失败')
        // 定义参数
        const query = {
          code: codeObj.code,
          encryptedData: succ.encryptedData,
          iv: succ.iv,
          rawData: succ.rawData,
          signature: succ.signature
        }
        console.log('参数对象', query)
        const {
          data: {
            message,
            meta
          }
        } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        // console.log('返回的数据',loginToken)
        // if (meta.status !== 200) return uni.$showMsg('登录失败！')
        // 登录成功
        uni.$showMsg('登录成功!')
        // 存储token-------后台接口有问题
        const tokens =
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEyLCJpYXQiOjE1MjU0MDIyMjMsImV4cCI6MTUyNTQ4ODYyM30.g-4GtEQNPwT_Xs0Pq7Lrco_9DfHQQsBiOKZerkO-O-o'
        this.updateToken(tokens)
        // 判断跳转
        this.navigateBackTo()
      },
      navigateBackTo() {
        if (this.redirectInfo && this.redirectInfo.swtype === 'switchTab') {
          uni.switchTab({
            url: this.redirectInfo.from,
            // 执行清除路由重定向------回调函数
            complete: () => {
              // vuex中的数据
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    },
  }
</script>

<style lang="scss">
  .login-container {
    // 登录盒子的样式
    height: 750rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f8f8f8;
    position: relative;
    overflow: hidden;

    // 绘制登录盒子底部的半椭圆造型
    &::after {
      content: ' ';
      display: block;
      position: absolute;
      width: 100%;
      height: 40px;
      left: 0;
      bottom: 0;
      background-color: white;
      // 椭圆形
      border-radius: 100%;
      // 移动后只显示上半部分
      transform: translateY(50%);
    }

    // 登录按钮的样式
    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #c00000;
    }

    // 按钮下方提示消息的样式
    .tips-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>
