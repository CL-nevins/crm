<template>
  <div class="dashboard-container">
    <div class="dashboard-text01">管理员: {{ nick_name }}</div>
    <div class="dashboard-text02">欢迎登录系统</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'nick_name',
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 50px;
  }
  &-text01 {
    font-size: 20px;
    line-height: 46px;
    text-align: left;
    color:blue;
  }
  &-text02 {
    margin-top: 30px;
    font-size: 40px;
    line-height: 46px;
    text-align: left;
  }
}
</style>
