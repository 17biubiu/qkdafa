<template>
  <section class="communication-container">
    <a-card :title="`欢迎你，${userInfo.nickname}`">
      <section class="container">
        <div>
          <a-avatar :size="50" :src="userInfo.avatarUrl" />
        </div>
        <div>
          <span>用户名：</span>
          {{userInfo.nickname}}
        </div>
        <div>
          <span>性别：</span>
          {{userInfo.gender ? "男" : "女"}}
        </div>
        <div>
          <span>所在地：</span>
          {{`${userInfo.country} ${userInfo.province} ${userInfo.city}`}}
        </div>
      </section>
    </a-card>
  </section>
</template>

<script>
import actions from '../shared/actions'
import { ApiGetUserInfo } from '../apis'

export default {
  name: 'Communication',
  data () {
    return {
      userInfo: {}
    }
  },

  methods: {
    async getUserInfo (token) {
      // ApiGetUserInfo 是用于获取用户信息的函数
      const result = await ApiGetUserInfo(token)
      this.userInfo = result.data.getUserInfo
    }
  },

  mounted () {
    // 注册观察者函数
    // onGlobalStateChange 第二个参数为true, 表示立即执行一次观察者函数
    actions.onGlobalStateChange(state => {
      console.log('state', state)
      const { token } = state
      // 未登录 - 返回主页
      if (!token) {
        this.$message.error('未检测到登录信息！')
        return this.$router.push('/')
      }
      // 获取用户信息
      this.getUserInfo(token)
    }, true)
  }
}
</script>
